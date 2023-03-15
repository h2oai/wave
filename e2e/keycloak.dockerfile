FROM quay.io/keycloak/keycloak:21.0.1

ADD ./realm.json /opt/keycloak/data/import/realm.json
RUN /opt/keycloak/bin/kc.sh import --file=/opt/keycloak/data/import/realm.json

ENV KEYCLOAK_ADMIN=admin
ENV KEYCLOAK_ADMIN_PASSWORD=admin

ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev"]