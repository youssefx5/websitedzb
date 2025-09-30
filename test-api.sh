#!/bin/bash
# API Testing Script for Ailes d'Espoir Backend

BASE_URL="http://localhost:3000/api"

echo "========================================="
echo "Ailes d'Espoir - Backend API Tests"
echo "========================================="
echo ""

# Test 1: Health Check
echo "Test 1: Health Check"
echo "---------------------"
curl -s "${BASE_URL}/health" | python3 -m json.tool
echo ""

# Test 2: Create Application
echo "Test 2: Create Application"
echo "--------------------------"
curl -s -X POST "${BASE_URL}/applications" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Jean Martin",
    "email": "jean.martin@example.com",
    "telephone": "+212 612 345 678",
    "ville": "Marrakech",
    "motivation": "Je veux faire une différence dans ma communauté",
    "apport": "Compétences en gestion de projet et organisation d'\''événements",
    "disponibilite": "regulier",
    "competences": ["gestion", "communication", "evenementiel"],
    "autresDetails": "10 ans d'\''expérience en gestion",
    "typeAdhesion": "actif",
    "newsletter": true
  }' | python3 -m json.tool
echo ""

# Test 3: Get All Applications
echo "Test 3: Get All Applications"
echo "-----------------------------"
curl -s "${BASE_URL}/applications" | python3 -m json.tool | head -30
echo ""

# Test 4: Get Statistics
echo "Test 4: Get Statistics"
echo "----------------------"
curl -s "${BASE_URL}/statistics" | python3 -m json.tool
echo ""

echo "========================================="
echo "All tests completed!"
echo "========================================="
