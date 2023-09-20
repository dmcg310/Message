package ws

import (
	"database/sql"
	"encoding/json"
	"github.com/dmcg310/Message/server/internal/routes"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

var (
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			allowedOrigin := "https://boisterous-duckanoo-b96168.netlify.app"
			return r.Header.Get("Origin") == allowedOrigin
		},
	}

	clients = make(map[*websocket.Conn]bool)
)

func NewWS(w http.ResponseWriter, r *http.Request, db *sql.DB, conversationID int) (err error) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return err
	}

	err = HandleMessage(conn, db, conversationID)
	if err != nil {
		return err
	}

	return nil
}

func HandleMessage(conn *websocket.Conn, db *sql.DB, conversationID int) (err error) {
	clients[conn] = true

	conversationDetails, err := routes.GetConversationDetails(db, conversationID)
	if err != nil {
		log.Println(err)
		return err
	}

	conversationJSON, err := json.Marshal(conversationDetails)
	if err != nil {
		log.Println(err)
		return err
	}

	if err = conn.WriteMessage(websocket.TextMessage, conversationJSON); err != nil {
		log.Println(err)
		return err
	}

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			delete(clients, conn)
			return err
		}

		for client := range clients {
			if err = client.WriteMessage(websocket.TextMessage, msg); err != nil {
				log.Println(err)
				continue
			}
		}
	}
}
