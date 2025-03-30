#!/bin/bash

# Ensure the lighthouse-tests directory exists
mkdir -p ./lighthouse-tests

# Base URL of your deployed site
BASE_URL="https://omnify-app.vercel.app"

# Specific tournament ID for the dynamic route
TOURNAMENT_ID="js7dj4skxpz6rnrrvtf4j3mqnd7cve88"

# List of pages to test (static and dynamic routes)
PAGES=(
  "/"                              # Root page
  "/sign-in"                      # Sign-in page
  "/sign-up"                      # Sign-up page
  "/become-a-member"             # Become a member page
  "/become-an-admin"             # Become an admin page
  "/contact-us"                  # Contact us page
  "/create-tournament"           # Create tournament page
  "/dashboard"                   # Dashboard page
  "/join-tournament"             # Join tournament page
  "/view-tournaments"            # View tournaments listing page
  "/view-tournaments/$TOURNAMENT_ID" # View specific tournament page
)

# Function to sanitize page name for filename
sanitize_filename() {
  echo "$1" | sed 's/\//-/g' | sed 's/^-//'
}

# Check if Lighthouse CLI is installed
if ! command -v lighthouse &> /dev/null; then
  echo "Lighthouse CLI is not installed. Please install it globally using:"
  echo "npm install -g lighthouse"
  exit 1
fi

# Loop through each page and run Lighthouse
for PAGE in "${PAGES[@]}"; do
  OUTPUT_FILE="./lighthouse-tests/lighthouse-report-$(sanitize_filename "$PAGE").html"
  echo "Running Lighthouse for $BASE_URL$PAGE..."
  lighthouse "$BASE_URL$PAGE" --output html --output-path "$OUTPUT_FILE" --quiet --chrome-flags="--enable-logging" 2> "./lighthouse-tests/error-$(sanitize_filename "$PAGE").log" || {
    echo "Failed to generate report for $PAGE. See error-$(sanitize_filename "$PAGE").log for details."
  }
  if [ -f "$OUTPUT_FILE" ]; then
    echo "Report saved to $OUTPUT_FILE"
  fi
done

echo "All Lighthouse tests completed!"