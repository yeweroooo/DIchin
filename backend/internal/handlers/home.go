package handlers

import (
	"log"
	"net/http"

	"dichin-backend/pkg/httpclient"

	"github.com/gin-gonic/gin"
)

type HomeHandler struct {
	client *httpclient.Client
}

func NewHomeHandler(c *httpclient.Client) *HomeHandler {
	return &HomeHandler{client: c}
}

func (h *HomeHandler) GetTrending(c *gin.Context) {
	h.proxyRequest(c, TrendingURL)
}

func (h *HomeHandler) GetForYou(c *gin.Context) {
	h.proxyRequest(c, ForYouURL)
}

func (h *HomeHandler) GetNew(c *gin.Context) {
	h.proxyRequest(c, NewURL)
}

func (h *HomeHandler) proxyRequest(c *gin.Context, url string) {

	headers := map[string]string{
		"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0",
		"Accept":     "application/json",
	}

	body, err := h.client.Get(url, headers)
	if err != nil {
		log.Printf("Error fetching URL %s: %v", url, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data from upstream"})
		return
	}


	c.Data(http.StatusOK, "application/json", body)
}
