package auth

import (
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return "", err
	}

	return string(hash), nil
}

func ComparePassword(hashedPassword, plainPassword string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(plainPassword)) == nil
}
