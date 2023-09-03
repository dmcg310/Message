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

	rows, err := db.Query("SELECT conversation_id FROM participants WHERE user_id = $1", userID)
	if err != nil {
		fmt.Println("Error retrieving conversations: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	defer rows.Close()

	var conversationIDs []int
	for rows.Next() {
		var conversationID int
		if err := rows.Scan(&conversationID); err != nil {
			fmt.Println("Error scanning conversation row: ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		conversationIDs = append(conversationIDs, conversationID)
	}

	var participants []string

	for _, conversationID := range conversationIDs {
		participantUsernames, err := GetParticipantUsernames(db, conversationID, userID)
		if err != nil {
			fmt.Println("Error retrieving participant usernames: ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		participants = append(participants, participantUsernames...)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	uniqueParticipants := removeDuplicates(participants)

	participantsJSON, err := json.Marshal(uniqueParticipants)
	if err != nil {
		fmt.Println("Error serializing participant names to JSON: ", err)
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

func removeDuplicates(s []string) []string {
	unique := make(map[string]struct{})
	result := []string{}
	for _, str := range s {
		if _, ok := unique[str]; !ok {
			unique[str] = struct{}{}
			result = append(result, str)
		}
	}

	return result
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

	return conversationDetails, nil
}
