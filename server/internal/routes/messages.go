package routes

import (
	"database/sql"
	"encoding/json"
	"fmt"
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

func Messages(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	userID, err := strconv.Atoi(r.Header.Get("User-Id"))
	if err != nil {
		fmt.Println("Error converting user ID to int: ", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	rows, err := db.Query("SELECT p.conversation_id, u.username FROM participants p JOIN users u ON p.user_id = u.id WHERE p.user_id = $1", userID)
	if err != nil {
		fmt.Println("Error retrieving conversations: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	defer rows.Close()

	type ConversationInfo struct {
		ConversationID int    `json:"conversation_id"`
		OtherUsername  string `json:"other_username"`
	}

	var conversations []ConversationInfo

	for rows.Next() {
		var conversationInfo ConversationInfo
		if err := rows.Scan(&conversationInfo.ConversationID, &conversationInfo.OtherUsername); err != nil {
			fmt.Println("Error scanning conversation row: ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		conversations = append(conversations, conversationInfo)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	participantsJSON, err := json.Marshal(conversations)
	if err != nil {
		fmt.Println("Error serializing conversation data to JSON: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	_, err = w.Write(participantsJSON)
	if err != nil {
		fmt.Println("Error writing JSON to response: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func GetParticipantUsernames(db *sql.DB, conversationID int, userID int) ([]string, error) {
	var participantUsernames []string

	rows, err := db.Query("SELECT username FROM users WHERE id IN (SELECT user_id FROM participants WHERE conversation_id = $1) AND id != $2", conversationID, userID)
	if err != nil {
		return participantUsernames, err
	}

	defer rows.Close()

	for rows.Next() {
		var username string
		if err := rows.Scan(&username); err != nil {
			return participantUsernames, err
		}

		participantUsernames = append(participantUsernames, username)
	}

	return participantUsernames, nil
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
	_, err = w.Write(conversationJSON)
	if err != nil {
		fmt.Println("Error writing JSON to response: ", err)
		return
	}
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

	fmt.Println("conversationDetails: ", conversationDetails)
	return conversationDetails, nil
}

func SendMessage(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	userID, err := strconv.Atoi(r.Header.Get("User-Id"))
	if err != nil {
		fmt.Println("Error converting user ID to int: ", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	vars := mux.Vars(r)
	conversationID, err := strconv.Atoi(vars["ConversationId"])
	if err != nil {
		fmt.Println("Error converting conversation ID to int: ", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var message struct {
		Content string `json:"content"`
	}

	err = json.NewDecoder(r.Body).Decode(&message)
	if err != nil {
		fmt.Println("Error decoding JSON: ", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	_, err = db.Exec("INSERT INTO messages (sender_id, conversation_id, content) VALUES ($1, $2, $3)", userID, conversationID, message.Content)
	if err != nil {
		fmt.Println("Error inserting message into database: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
