package ws

import (
	"database/sql"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

var (
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}
)

func NewWS(w http.ResponseWriter, r *http.Request, db *sql.DB) (err error) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return err
	}

	err = HandleMessage(conn, db)
	if err != nil {
		return err
	}

	return nil
}

func HandleMessage(conn *websocket.Conn, db *sql.DB) (err error) {
	// TODO: save message to database
	_ = db

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return err
		}

		// SendToClient(msg, conn.RemoteAddr())
		// log.Printf("(%s) <> %s\n", conn.RemoteAddr(), msg)

		if err = conn.WriteMessage(websocket.TextMessage, msg); err != nil {
			return err
		}
	}
}

// TODO: func SendToClient() {}
