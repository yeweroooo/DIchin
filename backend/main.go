package main

import (
	"log"

	"dichin-backend/backend/pkg/app"
)

func main() {
	r := app.Setup()
	port := app.GetEnv("PORT", "8080")
	log.Printf("Server running on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
