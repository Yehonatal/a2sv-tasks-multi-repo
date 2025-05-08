// cypress/support/commands.ts

Cypress.Commands.add("login", () => {
    cy.session(
        "userSession",
        () => {
            cy.visit("/login");
            cy.intercept("POST", "/api/auth/callback/akillogin").as(
                "akilLoginCallback"
            );
            cy.contains("button", "Login to Dev Account").click();

            cy.wait("@akilLoginCallback")
                .its("response.statusCode")
                .should("be.oneOf", [200, 302]);

            cy.url({ timeout: 10000 }).should(
                "eq",
                Cypress.config().baseUrl + "/"
            );

            // And ensure the NextAuth session cookie is set
            cy.getCookie("next-auth.session-token").should("exist");
        },
        {
            validate: () => {
                cy.getCookie("next-auth.session-token").should("exist");
            },
        }
    );
});
