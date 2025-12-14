package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"sync"

	"dichin-backend/pkg/httpclient"

	"github.com/gin-gonic/gin"
)

type DramaHandler struct {
	client *httpclient.Client
}

func NewDramaHandler(c *httpclient.Client) *DramaHandler {
	return &DramaHandler{client: c}
}

// Data Structures for JSON Unmarshaling
type DramaBasic struct {
	BookID       string   `json:"bookId"`
	BookName     string   `json:"bookName"`
	Cover        string   `json:"cover"`
	CoverWap     string   `json:"coverWap"`
	Introduction string   `json:"introduction"`
	Tags         []string `json:"tags"`
	TagNames     []string `json:"tagNames"` // Search returns tagNames
	Protagonist  string   `json:"protagonist"`
}

type ForYouItem struct {
	TagCardVo struct {
		TagBooks []DramaBasic `json:"tagBooks"`
	} `json:"tagCardVo"`
}

func (h *DramaHandler) GetEpisodes(c *gin.Context) {
	bookID := c.Query("bookId")
	if bookID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bookId parameter is required"})
		return
	}

	targetURL := fmt.Sprintf("%s?bookId=%s", EpisodeBaseURL, bookID)
	h.proxyRequest(c, targetURL)
}

func (h *DramaHandler) GetDetail(c *gin.Context) {
	bookID := c.Query("bookId")
	if bookID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bookId parameter is required"})
		return
	}

	// 1. Concurrent Fetch from Trending, New, ForYou
	var wg sync.WaitGroup
	var trendingList, newList []DramaBasic
	var forYouList []ForYouItem
	var errTrend, errNew, errForYou error

	wg.Add(3)
	go func() { defer wg.Done(); trendingList, errTrend = h.fetchList(TrendingURL) }()
	go func() { defer wg.Done(); newList, errNew = h.fetchList(NewURL) }()
	go func() { defer wg.Done(); forYouList, errForYou = h.fetchForYou(ForYouURL) }()

	wg.Wait()

	// 2. Linear Search for ID
	var foundDrama *DramaBasic

	// Check Trending
	if errTrend == nil {
		for _, d := range trendingList {
			if d.BookID == bookID {
				foundDrama = &d
				break
			}
		}
	}

	// Check New
	if foundDrama == nil && errNew == nil {
		for _, d := range newList {
			if d.BookID == bookID {
				foundDrama = &d
				break
			}
		}
	}

	// Check For You (This usually lacks intro, but gives us the Name)
	if foundDrama == nil && errForYou == nil {
		for _, item := range forYouList {
			for _, d := range item.TagCardVo.TagBooks {
				if d.BookID == bookID {
					// We iterate this to find the match
					// Create a copy to avoid pointer issues with loop var
					val := d
					foundDrama = &val
					break
				}
			}
			if foundDrama != nil {
				break
			}
		}
	}

	if foundDrama == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Drama not found in lists"})
		return
	}

	// 3. Improve Data (If introduction is missing, SEARCH by Name)
	if foundDrama.Introduction == "" && foundDrama.BookName != "" {
		searchResult, err := h.searchByName(foundDrama.BookName)
		if err == nil && searchResult != nil {
			// Merge info
			if searchResult.Introduction != "" {
				foundDrama.Introduction = searchResult.Introduction
			}
			if len(searchResult.TagNames) > 0 {
				foundDrama.Tags = searchResult.TagNames
			}
			if searchResult.Protagonist != "" {
				foundDrama.Protagonist = searchResult.Protagonist
			}
			// Prefer search cover if available and better? No, keep original.
		}
	}

	// Ensure Tags are populated (Search returns tagNames)
	if len(foundDrama.Tags) == 0 && len(foundDrama.TagNames) > 0 {
		foundDrama.Tags = foundDrama.TagNames
	}

	c.JSON(http.StatusOK, foundDrama)
}

func (h *DramaHandler) fetchList(url string) ([]DramaBasic, error) {
	headers := map[string]string{"User-Agent": "Mozilla/5.0"}
	body, err := h.client.Get(url, headers)
	if err != nil {
		return nil, err
	}
	var list []DramaBasic
	if err := json.Unmarshal(body, &list); err != nil {
		return nil, err
	}
	return list, nil
}

func (h *DramaHandler) fetchForYou(url string) ([]ForYouItem, error) {
	headers := map[string]string{"User-Agent": "Mozilla/5.0"}
	body, err := h.client.Get(url, headers)
	if err != nil {
		return nil, err
	}
	var list []ForYouItem
	if err := json.Unmarshal(body, &list); err != nil {
		return nil, err
	}
	return list, nil
}

func (h *DramaHandler) searchByName(query string) (*DramaBasic, error) {
	targetURL := fmt.Sprintf("%s?query=%s", SearchBaseURL, url.QueryEscape(query))
	headers := map[string]string{"User-Agent": "Mozilla/5.0"}
	body, err := h.client.Get(targetURL, headers)
	if err != nil {
		return nil, err
	}
	var list []DramaBasic
	if err := json.Unmarshal(body, &list); err != nil {
		return nil, err
	}
	if len(list) > 0 {
		return &list[0], nil
	}
	return nil, fmt.Errorf("not found")
}

func (h *DramaHandler) proxyRequest(c *gin.Context, url string) {
	headers := map[string]string{
		"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0",
		"Accept":     "application/json",
	}

	body, err := h.client.Get(url, headers)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch episodes"})
		return
	}

	c.Data(http.StatusOK, "application/json", body)
}
