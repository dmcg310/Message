package routes

import (
	"log"
	"net/http"
)

func Index(w http.ResponseWriter, r *http.Request) {
	_, err := w.Write([]byte("Hello, world!"))
	if err != nil {
		log.Printf("Could not write response: %s\n", err.Error())
	}
}
