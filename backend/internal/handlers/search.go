package handlers

import (
	"dichin-backend/pkg/httpclient"
	"fmt"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
)

type SearchHandler struct {
	client *httpclient.Client
}

func NewSearchHandler(c *httpclient.Client) *SearchHandler {
	return &SearchHandler{client: c}
}

func (h *SearchHandler) GetPopularSearch(c *gin.Context) {
	h.proxyRequest(c, PopularSearchURL)
}

func (h *SearchHandler) Search(c *gin.Context) {
	query := c.Query("query")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Query parameter is required"})
		return
	}

	targetURL := fmt.Sprintf("%s?query=%s", SearchBaseURL, url.QueryEscape(query))
	h.proxyRequest(c, targetURL)
}

func (h *SearchHandler) proxyRequest(c *gin.Context, url string) {
	headers := map[string]string{
		"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0",
		"Accept":     "application/json",
	}

	body, err := h.client.Get(url, headers)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data"})
		return
	}

	c.Data(http.StatusOK, "application/json", body)
}
