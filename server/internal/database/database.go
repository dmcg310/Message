package database

import (
	"database/sql"
	"fmt"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq" // do not remove
	"log"
	"os"
)

func LoadEnv() (DBNAME, USER, PASSWORD, HOST, PORT string) {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("No .env file found, looking for config vars...")
	}

	DBNAME = os.Getenv("POSTGRES_DB")
	USER = os.Getenv("POSTGRES_USER")
	PASSWORD = os.Getenv("POSTGRES_PASSWORD")
	HOST = os.Getenv("POSTGRES_HOST")
	PORT = os.Getenv("POSTGRES_PORT")

	if DBNAME == "" || USER == "" || PASSWORD == "" {
		log.Fatalf("Failed to load database config vars")
	}

	return DBNAME, USER, PASSWORD, HOST, PORT
}

func InitDatabase() *sql.DB {
	DBNAME, USER, PASSWORD, HOST, PORT := LoadEnv()
	conn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s",
		HOST, PORT, USER, PASSWORD, DBNAME)

	db, err := sql.Open("postgres", conn)
	if err != nil {
		log.Fatalf("Error opening database: %q", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatalf("Error connecting to database: %q", err)
	}

	return db
}
