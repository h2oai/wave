FROM alpine:3.18

COPY ../ai.h2o.wave.university.1.0.0.wave /app/ai.h2o.wave.university.1.0.0.wave
ENV WAVE_BUNDLE_FILE /app/ai.h2o.wave.university.1.0.0.wave
