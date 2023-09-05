package middleware

import (
	"github.com/dmcg310/Message/server/internal/auth"
	"net/http"
	"strconv"
)

func JWTMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tokenString := r.Header.Get("Authorization")
		if tokenString == "" {
			http.Error(w, "Authorization header not found", http.StatusUnauthorized)
			return
		}

		userID, err := auth.ParseJWT(tokenString)
		if err != nil {
			http.Error(w, "Invalid token JWTMiddleware", http.StatusUnauthorized)
			return
		}

		r.Header.Set("User-Id", strconv.Itoa(userID))

		next.ServeHTTP(w, r)
	}
}
