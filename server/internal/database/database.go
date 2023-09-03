package database

import (
	"database/sql"
	"fmt"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"log"
	"os"
)

func LoadEnv() (DBNAME, USER, PASSWORD string) {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %s", err)
	}

	return os.Getenv("POSTGRES_DB"), os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PASSWORD")
}

func InitDatabase() *sql.DB {
	DBNAME, USER, PASSWORD := LoadEnv()
	conn := fmt.Sprintf("user=%s password=%s dbname=%s sslmode=disable",
		USER, PASSWORD, DBNAME)

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
