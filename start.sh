make build-server

./waved \
    -oidc-client-id wave \
    -oidc-client-secret 78a895e1-af9d-46c4-a6b0-116e7644c054 \
    -oidc-redirect-url http://localhost:10101/_auth/callback \
    -oidc-provider-url http://localhost:8080/auth/realms/master \
    -oidc-end-session-url http://localhost:8080/auth/realms/master/protocol/openid-connect/logout \
    -web-dir ./ui/build
