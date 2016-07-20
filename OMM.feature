Feature: A calculator in the form a a quiz containing a set of multiple choice
questions which allows users work out which if they have an Olympian's mindset

Scenario: Load the core content
    Given that Bob has a a non-JavaScript enabled browser
    When Bob visits the page
    Then Bob should get only the core content

Scenario: Initiate the interactive quiz
    Given Bob has a modern web browser
    When Bob visits the page
    Then the quiz data should be created with empty 'score' values
    And Bob should see a list of questions

Scenario: Bob chooses an answer to a question
    Given that a given question has not yet been answered
    When Bob chooses an answer
    Then the chosen answer button should change colour
    And Bob should see some answer feedback
    And the quiz data for that answer should be updated

Scenario: Bob completes all questions
    Given that Bob has answered all questions
    Then the 'see results' button should be enabled

Scenario: Bob clicks the 'see results' button
    Given that the quiz has been completed,
    When Bob clicks on the 'see results' button,
    Then the quiz results should become visible
    And the 'start again' button should be visible
    And Bob should see his main strengths and weaknesses
    And which results category his fits into

Scenario: Bob chose the same score for 5 or more questions
    Given that Bob chose 5 or more answers with the same score
    When Bob clicks 'see results'
    Then Bob will not see any strengths or weaknesses in the results

Scenario: Bob scored 'Olympian'
    Given that Bob scored 'Olympian', which is the highest category
    When Bob clicks 'see results'
    Then Bob will see not see any weaknesses

Scenario: Bob clicks the 'start again' button
    Given that the 'start again' button is visible
    When Bob clicks on the 'start again' button
    Then the quiz data should be reset
    And the quiz results should be hidden
    And the answer buttons should be re-enabled

Scenario: Bob is younger than 17
    Given that Bob is under 17
    And we don't want to upset Bob or put him off sport
    When Bob clicks 'see results'
    Then he should not see a list of weaknesses
    And if Bob's final score is 18 or less
    Then Bob should see result band 3 (Fitness Fan)
    And Bob should see a link to 'BBC Get Inspired'

Scenario: Bob tells us he is not physically active
    Given that Bob answered 'not physically active' to the final question
    And that Bob is over 18 years old
    When Bob views his quiz results
    Then Bob should see a link to 'BBC Make Your Move'