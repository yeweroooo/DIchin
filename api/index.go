package handler

import (
	"net/http"

	"dichin-backend/backend/pkg/app"
)

// Handler is the entry point for Vercel Serverless Functions
func Handler(w http.ResponseWriter, r *http.Request) {
	app.Setup().ServeHTTP(w, r)
}
