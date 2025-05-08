/// <reference types="cypress" />

interface MockJob {
    id: string;
    title: string;
    orgName: string;
    logoUrl: string;
    isBookmarked: boolean;
}

interface BookmarkEntry {
    eventID: string;
    title: string;
    orgName: string;
    logoUrl: string;
}

describe("Bookmark Functionality", () => {
    const JOB_LISTING_URL = "/";
    const BOOKMARKS_URL = "/bookmarks";
    const firstJobId = "job-1";
    const firstJobTitle = "Senior Software Engineer";
    const jobCardSelector = (id: string) => `[data-testid="job-card-${id}"]`;
    const BOOKMARK_BTN = '[data-testid="bookmark-toggle-button"]';

    // Helper to intercept jobs
    const stubJobs = (body: MockJob[], alias: string) => {
        cy.intercept(
            "GET",
            "https://akil-backend.onrender.com/opportunities/search",
            { body }
        ).as(alias);
    };

    // Helper to intercept bookmarks (consistent shape)
    const stubBookmarks = (data: BookmarkEntry[], alias: string) => {
        cy.intercept("GET", "https://akil-backend.onrender.com/bookmarks", {
            body: { data, success: true, message: "" },
        }).as(alias);
    };

    beforeEach(() => {
        cy.login();

        // Initial listing and empty bookmarks
        cy.fixture<MockJob[]>("jobs.json").then((jobs) =>
            stubJobs(jobs, "getJobsInitial")
        );
        stubBookmarks([], "getBookmarksInitial");

        // Bookmark/unbookmark endpoints
        cy.intercept(
            "POST",
            `https://akil-backend.onrender.com/bookmarks/${firstJobId}`,
            {
                statusCode: 201,
                body: { success: true },
            }
        ).as("addBookmark");
        cy.intercept(
            "DELETE",
            `https://akil-backend.onrender.com/bookmarks/${firstJobId}`,
            {
                statusCode: 200,
                body: { success: true },
            }
        ).as("removeBookmark");

        cy.visit(JOB_LISTING_URL);
        cy.wait("@getJobsInitial");
        cy.wait("@getBookmarksInitial");
    });

    it("should allow bookmarking from the listing and view it on the bookmarks page", () => {
        // Prepare updated stubs *before* clicking
        cy.fixture<MockJob[]>("jobs.json").then((jobs) => {
            const updated = jobs.map((j) =>
                j.id === firstJobId ? { ...j, isBookmarked: true } : j
            );
            stubJobs(updated, "getJobsAfterBookmark");
            stubBookmarks(
                [
                    {
                        eventID: firstJobId,
                        title: firstJobTitle,
                        orgName: updated.find((j) => j.id === firstJobId)!
                            .orgName,
                        logoUrl: updated.find((j) => j.id === firstJobId)!
                            .logoUrl,
                    },
                ],
                "getBookmarksAfterBookmark"
            );
        });

        // Click bookmark
        cy.get(jobCardSelector(firstJobId)).within(() => {
            cy.get(BOOKMARK_BTN)
                .should("have.attr", "aria-pressed", "false")
                .click();
        });
        cy.wait("@addBookmark").its("response.statusCode").should("eq", 201);

        // Verify button toggles
        cy.get(jobCardSelector(firstJobId))
            .find(BOOKMARK_BTN)
            .should("have.attr", "aria-pressed", "true");

        // Go to bookmarks page
        cy.visit(BOOKMARKS_URL);
        cy.wait("@getBookmarksAfterBookmark", { timeout: 10000 });

        cy.contains(firstJobTitle).should("be.visible");
    });

    it("should allow unbookmarking from the listing page", () => {
        // Start with the job already bookmarked
        cy.fixture<MockJob[]>("jobs.json").then((jobs) => {
            const initiallyBookmarked = jobs.map((j) =>
                j.id === firstJobId ? { ...j, isBookmarked: true } : j
            );
            stubJobs(initiallyBookmarked, "getJobsInitialBookmarked");
            stubBookmarks(
                [
                    {
                        eventID: firstJobId,
                        title: firstJobTitle,
                        orgName: initiallyBookmarked.find(
                            (j) => j.id === firstJobId
                        )!.orgName,
                        logoUrl: initiallyBookmarked.find(
                            (j) => j.id === firstJobId
                        )!.logoUrl,
                    },
                ],
                "getBookmarksInitialBookmarked"
            );
        });

        cy.visit(JOB_LISTING_URL);
        cy.wait("@getJobsInitialBookmarked", { timeout: 10000 });
        cy.wait("@getBookmarksInitialBookmarked", { timeout: 10000 });

        // Prepare stubs for after unbookmark
        cy.fixture<MockJob[]>("jobs.json").then((jobs) => {
            stubJobs(jobs, "getJobsAfterUnbookmark");
            stubBookmarks([], "getBookmarksEmptyAfterUnbookmark");
        });

        // Click to unbookmark
        cy.get(jobCardSelector(firstJobId)).within(() => {
            cy.get(BOOKMARK_BTN)
                .should("have.attr", "aria-pressed", "true")
                .click();
        });
        cy.wait("@removeBookmark").its("response.statusCode").should("eq", 200);

        // Verify toggle
        cy.get(jobCardSelector(firstJobId))
            .find(BOOKMARK_BTN)
            .should("have.attr", "aria-pressed", "false");

        // Confirm bookmarks page is empty
        cy.visit(BOOKMARKS_URL);
        cy.wait("@getBookmarksEmptyAfterUnbookmark");
        cy.contains(firstJobTitle).should("not.exist");
    });

    it("should reflect unbookmarking from the bookmarks page on the main listing", () => {
        // Setup: initially bookmarked
        cy.fixture<MockJob[]>("jobs.json").then((jobs) => {
            const initial = jobs.map((j) =>
                j.id === firstJobId ? { ...j, isBookmarked: true } : j
            );
            stubJobs(initial, "getJobsInitialBookmarked");
            stubBookmarks(
                [
                    {
                        eventID: firstJobId,
                        title: firstJobTitle,
                        orgName: initial.find((j) => j.id === firstJobId)!
                            .orgName,
                        logoUrl: initial.find((j) => j.id === firstJobId)!
                            .logoUrl,
                    },
                ],
                "getBookmarksInitialBookmarked"
            );
        });

        cy.visit(BOOKMARKS_URL);
        cy.wait("@getBookmarksInitialBookmarked");

        // Prepare after‑unbookmark stubs
        cy.fixture<MockJob[]>("jobs.json").then((jobs) => {
            stubJobs(jobs, "getJobsAfterUnbookmarkFromBookmarks");
            stubBookmarks([], "getBookmarksEmptyAfterUnbookmarkFromBookmarks");
        });

        // Unbookmark on bookmarks page
        cy.get(BOOKMARK_BTN)
            .should("have.attr", "aria-pressed", "true")
            .click();
        cy.wait("@removeBookmark");

        cy.visit(BOOKMARKS_URL);
        cy.wait("@getBookmarksEmptyAfterUnbookmarkFromBookmarks");
        cy.contains(firstJobTitle).should("not.exist");

        // Back to listing
        cy.visit(JOB_LISTING_URL);
        cy.wait("@getJobsAfterUnbookmarkFromBookmarks");
        cy.get(jobCardSelector(firstJobId))
            .find(BOOKMARK_BTN)
            .should("have.attr", "aria-pressed", "false");
    });

    it("should persist bookmark status on reload", () => {
        // Bookmark it
        cy.fixture<MockJob[]>("jobs.json").then((jobs) => {
            const bookmarked = jobs.map((j) =>
                j.id === firstJobId ? { ...j, isBookmarked: true } : j
            );
            stubJobs(bookmarked, "getJobsPersisted");
            stubBookmarks(
                [
                    {
                        eventID: firstJobId,
                        title: firstJobTitle,
                        orgName: bookmarked.find((j) => j.id === firstJobId)!
                            .orgName,
                        logoUrl: bookmarked.find((j) => j.id === firstJobId)!
                            .logoUrl,
                    },
                ],
                "getBookmarksPersisted"
            );
        });

        cy.get(jobCardSelector(firstJobId)).within(() => {
            cy.get(BOOKMARK_BTN).click();
        });
        cy.wait("@addBookmark");

        // Reload and verify
        cy.reload();
        cy.wait("@getJobsPersisted");
        cy.get(jobCardSelector(firstJobId))
            .find(BOOKMARK_BTN)
            .should("have.attr", "aria-pressed", "true");

        // And on the bookmarks page
        cy.visit(BOOKMARKS_URL);
        cy.wait("@getBookmarksPersisted");
        cy.contains(firstJobTitle).should("be.visible");
    });
});
