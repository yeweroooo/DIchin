package main

import (
	"log"
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/secure"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	limiter "github.com/ulule/limiter/v3"
	mgin "github.com/ulule/limiter/v3/drivers/middleware/gin"
	"github.com/ulule/limiter/v3/drivers/store/memory"

	"dichin-backend/internal/handlers"
	"dichin-backend/pkg/httpclient"
)

func main() {

	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using default settings")
	}

	r := gin.Default()


	r.Use(secure.New(secure.Config{
		STSSeconds:            315360000,
		STSIncludeSubdomains:  true,
		FrameDeny:             true,
		ContentTypeNosniff:    true,
		BrowserXssFilter:      true,
		ContentSecurityPolicy: "default-src 'self'",
		IENoOpen:              true,
		ReferrerPolicy:        "strict-origin-when-cross-origin",
		SSLProxyHeaders:       map[string]string{"X-Forwarded-Proto": "https"},
	}))



	rate, err := limiter.NewRateFromFormatted(getEnv("RATE_LIMIT", "20-S"))
	if err != nil {
		log.Fatal(err)
	}
	store := memory.NewStore()
	instance := limiter.New(store, rate)
	r.Use(mgin.NewMiddleware(instance))


	allowedOrigins := strings.Split(getEnv("ALLOWED_ORIGINS", "*"), ",")
	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))


	client := httpclient.NewClient()


	homeHandler := handlers.NewHomeHandler(client)
	searchHandler := handlers.NewSearchHandler(client)
	dramaHandler := handlers.NewDramaHandler(client)


	api := r.Group("/api")
	{

		api.GET("/home/trending", homeHandler.GetTrending)
		api.GET("/home/foryou", homeHandler.GetForYou)
		api.GET("/home/new", homeHandler.GetNew)


		api.GET("/search/popular", searchHandler.GetPopularSearch)
		api.GET("/search", searchHandler.Search)


		api.GET("/drama/episodes", dramaHandler.GetEpisodes)
		api.GET("/drama/detail", dramaHandler.GetDetail)
	}

	port := getEnv("PORT", "8080")
	log.Printf("Server running on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
