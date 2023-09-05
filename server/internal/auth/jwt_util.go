package auth

import (
	"github.com/golang-jwt/jwt/v5"
	"os"
	"time"
)

var jwtKey = []byte(os.Getenv("JWT_SECRET"))

func GenerateJWT(userId int) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userId,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func ParseJWT(tokenString string) (int, error) {
	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if err != nil || !token.Valid {
		return 0, err
	}

	userID := int(claims["user_id"].(float64))

	return userID, nil
}
