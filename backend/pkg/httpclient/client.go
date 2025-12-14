package httpclient

import (
	"fmt"
	"time"

	"github.com/valyala/fasthttp"
)

type Client struct {
	client *fasthttp.Client
}

const (
	MaxRetries = 3
	Timeout    = 10 * time.Minute
)

func NewClient() *Client {
	return &Client{
		client: &fasthttp.Client{
			ReadTimeout:  Timeout,
			WriteTimeout: Timeout,
			MaxConnsPerHost: 1000,
		},
	}
}

// Get performs a GET request with retry logic
func (c *Client) Get(url string, headers map[string]string) ([]byte, error) {
	req := fasthttp.AcquireRequest()
	resp := fasthttp.AcquireResponse()
	defer fasthttp.ReleaseRequest(req)
	defer fasthttp.ReleaseResponse(resp)

	req.SetRequestURI(url)
	req.Header.SetMethod(fasthttp.MethodGet)
	
	for k, v := range headers {
		req.Header.Set(k, v)
	}

	var err error
	for i := 0; i < MaxRetries; i++ {
		if i > 0 {
			// Exponential backoff or simple delay
			time.Sleep(time.Duration(i*2) * time.Second)
			fmt.Printf("Retrying request to %s (Attempt %d/%d)\n", url, i+1, MaxRetries)
		}

		err = c.client.Do(req, resp)
		if err == nil && resp.StatusCode() == fasthttp.StatusOK {
			return resp.Body(), nil
		}
		
		if err != nil {
			fmt.Printf("Request failed: %v\n", err)
		} else {
			fmt.Printf("Request failed with status: %d\n", resp.StatusCode())
		}
	}

	if err != nil {
		return nil, fmt.Errorf("failed after %d retries: %w", MaxRetries, err)
	}
	return nil, fmt.Errorf("failed after %d retries with status code: %d", MaxRetries, resp.StatusCode())
}
