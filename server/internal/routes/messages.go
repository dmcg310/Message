package routes

import (
	"log"
	"net/http"
)

func Messages(w http.ResponseWriter, r *http.Request) {
	_, err := w.Write([]byte("Messages"))
	if err != nil {
		log.Printf("Could not write response: %s\n", err.Error())
	}
}
