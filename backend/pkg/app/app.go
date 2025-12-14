package app

import (
	"log"
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/secure"
	"github.com/gin-gonic/gin"
	libgodotenv "github.com/joho/godotenv"
	limiter "github.com/ulule/limiter/v3"
	mgin "github.com/ulule/limiter/v3/drivers/middleware/gin"
	"github.com/ulule/limiter/v3/drivers/store/memory"

	"dichin-backend/backend/internal/handlers"
	"dichin-backend/backend/pkg/httpclient"
)

func Setup() *gin.Engine {
	if err := libgodotenv.Load(); err != nil {
		// Only log, don't fail, as Vercel uses env vars directly
		log.Println("Note: .env file not found, using environment variables")
	}

	r := gin.New() // Use New() to avoid default Logger causing IO issues in serverless if not cached properly, but Default() is usually fine. Sticking to Default() or adding specific middleware.
	r.Use(gin.Recovery())
	// Add logger if needed, but standard log is fine for Vercel

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

	rate, err := limiter.NewRateFromFormatted(GetEnv("RATE_LIMIT", "20-S"))
	if err != nil {
		log.Fatal(err)
	}
	store := memory.NewStore()
	instance := limiter.New(store, rate)
	r.Use(mgin.NewMiddleware(instance))

	allowedOrigins := strings.Split(GetEnv("ALLOWED_ORIGINS", "*"), ",")
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

	return r
}

func GetEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
