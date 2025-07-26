#!/bin/bash

set -e

YAML_FILE="pnpm-workspace.yaml"
TEMP_JSON="catalog.temp.json"

echo "🔍 Updating centralized catalog deps..."

# Step 1: Extract catalog block and wrap in "dependencies"
yq -o=json '.catalog | {"dependencies": .}' "$YAML_FILE" > "$TEMP_JSON"

# Step 2: Update dependencies using npm-check-updates
echo "⬆️  Running npm-check-updates on catalog..."
ncu -l silent --packageFile "$TEMP_JSON" --dep prod -u

# Step 3: Convert updated catalog back to YAML
UPDATED_CATALOG=$(yq e -P -I 2 '.dependencies' "$TEMP_JSON")

# Step 4: Extract updated deps as YAML
yq -o=yaml -I 2 '.dependencies' "$TEMP_JSON" > catalog.updated.yaml

# Step 5: Properly insert the YAML block as native map
yq e 'del(.catalog) | .catalog = load("catalog.updated.yaml")' "$YAML_FILE" > "${YAML_FILE}.tmp" && mv "${YAML_FILE}.tmp" "$YAML_FILE"

# Step 6: Clean up
rm "$TEMP_JSON" catalog.updated.yaml
echo "✅ Catalog updated."

echo ""
echo "🔄 Updating local dependencies across all workspaces..."

# Step 7: Update all workspace package.json files
ncu -l silent -u -ws 

echo "✅ All workspace dependencies updated."

# clean node_modules
echo "🧹 Cleaning node_modules..."
pnpm run clean

echo "Installing updated dependencies..."
pnpm i

echo "✅ Installation complete."
