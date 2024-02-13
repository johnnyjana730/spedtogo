from botasaurus import *

@browser(
  headless=False, 
)
def scrape_entity_info(driver: AntiDetectDriver, data, query=""):
    # Navigate to the Omkar Cloud website
    driver.get("https://www.google.com/search?q=" + query)

    # Retrieve the heading element's text
    # Extract rating
    # rating_selector = "div.F7nice > span"
    rating_selector = "div.v7W49e"
    heading = driver.text(rating_selector)
    # driver.close()
    # Save the data as a JSON file in output/scrape_heading_task.json
    return heading