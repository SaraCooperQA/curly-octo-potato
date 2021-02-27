

context('Magazine Regression', () => {
    //adding 3rd party libraries
    const faker = require('faker'); //used to fake email 

    //Test data generation
    let userData = {
        randomEmail: faker.internet.email()
    }
    //visits the URL provided via cypress.json file for each test
    beforeEach(() => {
        cy.visit('/')
    })

    it('Test 1 - Search for any location on Magazine by using the search bar ', () => {

        // Searches for any location on the website
        // Verifies that the search return results

        //Clicks on the Search icon on homepage
        cy.get("div[class='search-icon']").click();

        // Types for Dusseldorf in the search input field and press enter to search
        cy.get("input[class='input search-input']",{ timeout: 15000 }).type("Dusseldorf{enter}").should('have.value', 'Dusseldorf')

        //Verifies the result from the search appears
        cy.get("h3[class='section-title']", { timeout: 15000 }).contains("Search Results").should('be.visible')
    })

    it('Test 2 - Fill in the contact form and send it (accessible through the footer)', () => {

        cy.get('#footer-main').scrollIntoView() // Scrolls into 'footer'  view

        // Clicks on the contact link on the homepage, removes the target attribute to open it in the same tab
        cy.xpath("//a[normalize-space()='Contact']",{ timeout: 15000 }).invoke('removeAttr', 'target').click();

        // Selects the message area element and enters the message, verifies the message
        cy.get("textarea[class='contact-msg']",{ timeout: 15000 }).type("This is a test message for regression of Trivago Magazine").should('have.value', 'This is a test message for regression of Trivago Magazine')

        // Types Full name in the field and verifies it
        cy.xpath("//div[normalize-space()='Full Name']//input[@type='text']").type("Test Name").should('have.value', 'Test Name')

        // Types email in the field and verifies it
        cy.get("#contact-email").type("test@test.com").should('have.value', 'test@test.com')

        //confirms the checkbox
        cy.get("#confirm").click();

        //Submits the form
        cy.get("button[class='contact-submit']").click();

        //Verifies the message is sent successfully
        cy.get("p[class='feedback']", { timeout: 15000 }).contains("Message Sent Successfully!").should('be.visible')
    })

    it('Test 3 - Subscribe to the Newsletter', () => {

        cy.get("div[class='newsletter-title-rover-2']").scrollIntoView() // Scrolls into 'newsletter'  view

        // enters email to subscribe to the newsletter
        cy.xpath("//input[@name='email']", { delay: 300 }).eq(0).click().clear().type(userData.randomEmail);

        //clicks on the inspire me button to submit email data
        cy.get("button[type='submit']").click();

        //Verifies the result from the search appears
        cy.get("p[class='submitted h1']", { timeout: 15000 }).contains("You are now checked-in!").should('be.visible');
    })

    it('Test 4 - Navigate to a destination through the menu on the top left', () => {

        // clicks on the menu in the top left corner
        cy.get("div[class='nav-icon']").click();

        //clicks on the destinations
        cy.xpath("//div[@class='menu-title'][normalize-space()='Destinations']").click();

        //Clicks on the Midwest destinations
        cy.xpath("//div[contains(text(),'Midwest')]").click();

        //Verifies that it redirects to the correct Midwest destinations page 
        cy.xpath("//h1[normalize-space()='Midwest']", { timeout: 15000 }).contains("Midwest").should('be.visible');

        //clicks on the Michigan destination
        cy.xpath("//a[@href='/destination/michigan/']//div[@class='card-container']//div[@class='destination-card destination-card-carousel']").click();


        //Verifies that user is on the correct page
        cy.get("div[class='hero-title caps']", { timeout: 15000 }).contains("Michigan").should('be.visible');
    })

    it('Test 5 - Checking all the links on the homepage are working', () => {

        //Visits the homepage and checks all the valid links one by one using API call and gets their status code as 200 which means success

        cy.get('a')
        .each(($a) => {
            console.log('$a', $a);
            const href = $a.prop('href');
            console.log('href', href)
            if(href==="" || href.includes('linkedin') || href.includes('javascript')){ //skipping all the invalid links with null, javascript void or LinkedIn (LinkedIn does not allow automated checking)
                return;
            }
            cy.request(encodeURI(href), function (error, response, body) {
                return response.statusCode.then(function (code) {
                    if(code == 404){
                        throw new Error('whoops! broken link', href);
                    }
                    expect(code).to.eq(200);
                })
            })
        })
    })

})