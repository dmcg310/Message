package routes

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type ConversationDetails struct {
	ConversationId int
	Participants   []string
	Messages       []Message
}

type Message struct {
	SenderUsername string
	Content        string
	CreatedAt      string
}

func Messages(w http.ResponseWriter, r *http.Request) {
	_, err := w.Write([]byte("Messages"))
	if err != nil {
		log.Printf("Could not write response: %s\n", err.Error())
	}
}

func FetchConversations(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	vars := mux.Vars(r)
	conversationID, err := strconv.Atoi(vars["ConversationId"])
	if err != nil {
		fmt.Println("Error converting conversation ID to int: ", err)
		return
	}

	conversationDetails, err := GetConversationDetails(db, conversationID)
	if err != nil {
		fmt.Println("Error retrieving conversation details: ", err)
		return
	}

	conversationJSON, err := json.Marshal(conversationDetails)
	if err != nil {
		fmt.Println("Error serializing conversation details to JSON: ", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(conversationJSON)
}

func GetConversationDetails(db *sql.DB, conversationID int) (conversationDetails ConversationDetails, err error) {
	var (
		participantUserIDs []int
		messages           []Message
	)

	rows, err := db.Query("SELECT user_id FROM participants WHERE conversation_id = $1", conversationID)
	if err != nil {
		fmt.Println("Error retrieving participants: ", err)
		return conversationDetails, err
	}

	defer rows.Close()

	for rows.Next() {
		var userID int
		if err := rows.Scan(&userID); err != nil {
			fmt.Println("Error scanning participant row: ", err)
			return conversationDetails, err
		}

		participantUserIDs = append(participantUserIDs, userID)
	}

	var participants []string
	for _, userID := range participantUserIDs {
		var username string
		err := db.QueryRow("SELECT username FROM users WHERE id = $1", userID).Scan(&username)
		if err != nil {
			fmt.Println("Error retrieving username: ", err)
			return conversationDetails, err
		}

		participants = append(participants, username)
	}

	rows, err = db.Query("SELECT sender_id, content, created_at FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC", conversationID)
	if err != nil {
		fmt.Println("Error retrieving messages: ", err)
		return conversationDetails, err
	}

	defer rows.Close()

	for rows.Next() {
		var (
			senderID  int
			content   string
			createdAt string
		)
		if err := rows.Scan(&senderID, &content, &createdAt); err != nil {
			fmt.Println("Error scanning message row: ", err)
			return conversationDetails, err
		}

		var senderUsername string
		err := db.QueryRow("SELECT username FROM users WHERE id = $1", senderID).Scan(&senderUsername)
		if err != nil {
			fmt.Println("Error retrieving sender's username: ", err)
			return conversationDetails, err
		}

		message := Message{
			SenderUsername: senderUsername,
			Content:        content,
			CreatedAt:      createdAt,
		}
		messages = append(messages, message)
	}

	conversationDetails.ConversationId = conversationID
	conversationDetails.Participants = participants
	conversationDetails.Messages = messages

	return conversationDetails, nil
}
