<template>
  <v-container fluid class="pa-0">
    <v-row class="pl-5">
      <v-row class="d-flex justify-center align-center flex-nowrap">
        <v-col cols="auto" class="text-center pa-0">
          <v-title
            class="d-flex justify-center align-center text-h5 text-sm-h4 pt-12"
            style="white-space: nowrap; font-size: clamp(1.5rem, 3vw, 2.5rem)"
          >
            <strong>DRUNAGOR NIGHTS</strong> 
          </v-title>
        </v-col>
      </v-row>
      <br />
      <v-col cols="12" class="d-flex justify-center align-center">
        <iframe
          width="900"
          height="450"
          src="https://www.youtube.com/embed/MSSmAAQ0feY?si=eQYU2ohG4j9V8G-D"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      </v-col>

      <!-- Texto abaixo do vídeo -->
      <v-row>
        <v-col cols="12" class="d-flex justify-center align-center">
          <p
            class="text-center text-body-1"
            style="font-size: clamp(1rem, 1.5vw, 1.2rem)"
          >
            Watch the video above to learn why
            <strong>Drunagor Nights</strong> is the must-have event for your
            store in 2025!
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card class="pa-4 pl-6" color="white" elevation="2">
            <v-row class="d-flex justify-center align-center">
              <!-- Texto Principal -->
              <v-col
                cols="12"
                class="text-center text-h6 p-0"
                style="margin-bottom: 0"
              >
                Drunagor Nights 2025:
              </v-col>

              <!-- Subtítulo -->
              <v-col
                cols="12"
                class="text-center text-h6 p-0"
                style="margin-top: 0"
              >
                The Ultimate Organized Play Event for Your Store!
              </v-col>
            </v-row>

            <br />
            <p>
              Welcome to <strong>Drunagor Nights</strong>, the most exciting
              <strong>Organized Play event</strong> of 2025! Drive customers
              into your FLGS with <strong>exclusive content</strong>, amazing
              adventures, and an epic
              <strong>Mega Dungeon experience</strong> created just for this
              event.
            </p>
            <br />

            <strong
              class="d-flex justify-center align-center text-h7 text-md-h5"
              >Secure Your Store’s Spot NOW!</strong
            >
            <br />

            <v-row>
              <v-col cols="12" class="d-md-flex justify-center">
                <ul style="text-align: left; max-width: 800px">
                  <li>
                    <strong>Limited Availability:</strong> Spots are filling up
                    fast, and this pre-order is the
                    <strong>ONLY way to guarantee participation</strong> if
                    you’re not attending GAMA.
                  </li>
                  <li>
                    <strong>Unbeatable Value:</strong> Get an Organized Play Kit
                    worth over <strong>$3,500 MSRP</strong> for only
                    <strong>$1,500</strong>, including over
                    <strong>$300 in freebies!</strong>
                  </li>
                  <li>
                    <strong>Exclusive Adventures:</strong> Engage your community
                    with <strong>Summer (June-September)</strong> and
                    <strong>Winter (November-February 2026)</strong> seasons of
                    adventure.
                  </li>
                </ul>
              </v-col>
            </v-row>

            <p>
              <strong
                class="d-flex justify-center align-center text-h6 pt-12 text-md-h5 pr-7"
                style="white-space: nowrap; font-size: clamp(1rem, 2.5vw, 2rem)"
              >
                <br />Don’t Miss Out!</strong
              >
            </p>
            <br />

            <v-col class="text-center pr-7">
              <p>
                Click the button below to
                <strong>pre-order your Drunagor Nights Bundle</strong> and
                secure your store’s place in this
                <strong>nationwide event</strong>.
              </p>
              <p>
                <strong>Sign up now and embark on your next adventure!</strong>
              </p>
            </v-col>

            <br />
            <v-row
              class="d-flex justify-center align-center"
              style="height: 100%"
            >
              <v-col cols="auto" class="d-flex justify-center">
                <v-btn
                  class="text-h6"
                  href="https://store.wearecgs.com/product/0917/"
                  target="_blank"
                  elevation="2"
                >
                  👉 PRE-ORDER NOW
                </v-btn>
              </v-col>
            </v-row>
            <p class="d-flex justify-center align-center">
              <br />
              <br />
              Limited Spots Available! :::
            </p>
            <p class="d-flex justify-center align-center font-italic">
              Shipping starts May 2025
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-row>
    <br />
  </v-container>
</template>
  
  <script setup>
import { VContainer, VRow, VCol } from "vuetify/components";
</script>
  