<template>
  <div class="box-assembly-page-wrapper">
    <div class="page-background"></div>
    <v-container max-width="750" class="py-4 safe-area-padding guide-container px-2 px-sm-4">
      
      <!-- Back Button - Top Left -->
      <v-btn
        icon="mdi-arrow-left"
        variant="tonal"
        color="white"
        @click="router.push({ name: 'RetailerTutorial' })"
        class="back-button position-absolute"
        style="left: 16px; top: 16px;"
        title="Back to Retailer Guide"
      ></v-btn>

      <!-- Main Header Title (Outside Card) -->
      <div class="text-center mt-2 mb-4">
        <h1 class="main-header-title text-white font-weight-black text-center text-uppercase">
          BOX ASSEMBLY<br />& OGANIZATION
        </h1>
      </div>

      <!-- Single Main Card Container -->
      <v-card class="main-box-card rounded-xl pa-4 pa-sm-6 text-left elevation-16 overflow-hidden">
        
        <!-- Subtitle Text (INSIDE Card at the Top) -->
        <p class="subtitle-text text-center font-style-italic mb-6 mx-auto">
          Navigate through this page to learn how to organize your components and assemble your game box for Drunagor Nights. If you prefer to follow a PDF guide,
          <a
            href="https://s3.us-east-2.amazonaws.com/assets.drunagor.app/retaitlertutorial/box-assembly-guide/RETAILER+MANUAL+-+OP+KIT+preparation.pdf"
            target="_blank"
            rel="noopener noreferrer"
            class="pdf-guide-link"
          >click here<v-icon size="x-small" style="color: #BCA341;" class="ml-0.5">mdi-open-in-new</v-icon></a>.
        </p>

        <!-- ================= STEP 1 ================= -->
        <div class="step-section mb-4">
          <!-- Step Banner Header -->
          <div 
            class="step-banner rounded-lg d-flex align-center cursor-pointer"
            :class="{ 'banner-open': openSteps[1] }"
            @click="toggleStep(1)"
          >
            <span class="step-badge badge-step-1">STEP 1</span>
            <h2 class="step-title single-line-title font-weight-bold text-white pl-3 pr-3 py-2.5 flex-grow-1">
              The “Age of Darkness” Core Box
            </h2>
          </div>

          <!-- Expandable Content for Step 1 with Grey Background -->
          <v-expand-transition>
            <div v-show="openSteps[1]" class="step-open-container pt-4 pb-4 px-3 px-sm-5 mb-4">
              <p class="intro-p text-white mb-5">
                Open the <strong class="text-white font-weight-bold">Core Box</strong> and let’s sort through the components.
              </p>

              <!-- 1.1 -->
              <div class="substep-block mb-5">
                <h3 class="substep-heading font-weight-bold text-white mb-2">
                  1.1 – What you should <strong class="text-white font-weight-black">SET ASIDE</strong> (we won’t be using these):
                </h3>
                <div class="checklist-items">
                  <div 
                    v-for="item in step1SetAsideItems" 
                    :key="item.id"
                    class="checklist-row d-flex align-start py-2.5 cursor-pointer mb-1"
                    :class="{ 'row-checked': isChecked(item.id) }"
                    @click="handleItemClick(item)"
                  >
                    <div 
                      class="custom-checkbox flex-shrink-0" 
                      :class="{ 'checked': isChecked(item.id) }"
                      @click.stop="handleItemClick(item)"
                    ></div>
                    <span class="row-label text-white flex-grow-1" v-html="item.label"></span>
                  </div>
                </div>
              </div>

              <!-- 1.2 -->
              <div class="substep-block mb-5">
                <h3 class="substep-heading font-weight-bold text-white mb-2">
                  1.2 – What you should <strong class="text-white font-weight-black">SEPARATE</strong> (keep nearby):
                </h3>
                <div class="checklist-items">
                  <div 
                    v-for="item in step1SeparateItems" 
                    :key="item.id"
                    class="checklist-row d-flex align-start py-2.5 cursor-pointer mb-1"
                    :class="{ 'row-checked': isChecked(item.id) }"
                    @click="handleItemClick(item)"
                  >
                    <div 
                      class="custom-checkbox flex-shrink-0" 
                      :class="{ 'checked': isChecked(item.id) }"
                      @click.stop="handleItemClick(item)"
                    ></div>
                    <span class="row-label text-white flex-grow-1" v-html="item.label"></span>
                  </div>
                </div>
                <p class="note-text text-grey-lighten-1 mt-2 pl-7">
                  Note: The Large Miniatures Tray is located at the bottom of the box.
                </p>
              </div>

              <!-- 1.3 -->
              <div class="substep-block">
                <h3 class="substep-heading font-weight-bold text-white mb-2">
                  1.3 – Organizing the Core Box:
                </h3>
                <div class="checklist-items">
                  <div 
                    v-for="item in step1OrganizeItems" 
                    :key="item.id"
                    class="checklist-row d-flex align-start py-2.5 cursor-pointer mb-1"
                    :class="{ 'row-checked': isChecked(item.id) }"
                    @click="handleItemClick(item)"
                  >
                    <div 
                      class="custom-checkbox flex-shrink-0" 
                      :class="{ 'checked': isChecked(item.id) }"
                      @click.stop="handleItemClick(item)"
                    ></div>
                    <div class="row-label text-white flex-grow-1">
                      <span v-html="item.label"></span>
                      <div v-if="item.details" class="sub-bullets pl-3 mt-2">
                        <div v-for="(detail, dIdx) in item.details" :key="dIdx" class="d-flex align-start mb-1.5 cursor-pointer" @click.stop="handleItemClick(detail)">
                          <div 
                            class="custom-checkbox flex-shrink-0 mr-2" 
                            :class="{ 'checked': isChecked(detail.id) }"
                            @click.stop="handleItemClick(detail)"
                          ></div>
                          <span v-html="detail.label"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-expand-transition>
        </div>

        <!-- ================= STEP 2 ================= -->
        <div class="step-section mb-4">
          <!-- Step Banner Header -->
          <div 
            class="step-banner rounded-lg d-flex align-center cursor-pointer"
            :class="{ 'banner-open': openSteps[2] }"
            @click="toggleStep(2)"
          >
            <span class="step-badge badge-step-2">STEP 2</span>
            <h2 class="step-title single-line-title font-weight-bold text-white pl-3 pr-3 py-2.5 flex-grow-1">
              The Organized Play Kit
            </h2>
          </div>

          <!-- Expandable Content for Step 2 with Grey Background -->
          <v-expand-transition>
            <div v-show="openSteps[2]" class="step-open-container pt-4 pb-4 px-3 px-sm-5 mb-4">
              <p class="intro-p text-white mb-5">
                Open the <strong class="text-white font-weight-bold">Organized Play Kit</strong> and combine its contents with the components we have already prepared.
              </p>

              <!-- Kit Box Image -->
              <div class="text-center my-5">
                <v-img
                  :src="getImg('Drunagor Nights Box.png')"
                  alt="Organized Play Kit Box"
                  max-width="280"
                  class="mx-auto rounded-lg shadow-elevation-8 cursor-pointer"
                  @click="openModal({ id: 'op_kit_box', title: 'Organized Play Kit', image: getImg('Drunagor Nights Box.png') })"
                >
                  <template v-slot:error>
                    <div class="box-preview-fallback rounded-lg pa-5 text-center mx-auto" style="max-width: 280px;">
                      <v-icon size="40" color="cyan-accent-3" class="mb-1">mdi-package-variant</v-icon>
                      <div class="text-caption font-weight-bold text-white">Organized Play Kit Box</div>
                    </div>
                  </template>
                </v-img>
              </div>

              <!-- 2.1 -->
              <div class="substep-block mb-5">
                <h3 class="substep-heading font-weight-bold text-white mb-2">
                  2.1 – What to separate:
                </h3>
                <div class="checklist-items">
                  <div 
                    v-for="item in step2SeparateItems" 
                    :key="item.id"
                    class="checklist-row d-flex align-start py-2.5 cursor-pointer mb-1"
                    :class="{ 'row-checked': isChecked(item.id) }"
                    @click="handleItemClick(item)"
                  >
                    <div 
                      class="custom-checkbox flex-shrink-0" 
                      :class="{ 'checked': isChecked(item.id) }"
                      @click.stop="handleItemClick(item)"
                    ></div>
                    <span class="row-label text-white flex-grow-1" v-html="item.label"></span>
                  </div>
                </div>

                <!-- Gift Cards Image -->
                <div class="text-center my-4">
                  <v-img
                    :src="getImg('GIFT CARDS.png')"
                    alt="Gift Item Cards"
                    max-width="400"
                    class="mx-auto rounded-lg cursor-pointer"
                    @click="openModal({ id: 'step2_1_gift_cards', title: 'Gift Item Cards (80x)', image: getImg('GIFT CARDS.png') })"
                  >
                    <template v-slot:error>
                      <div class="cards-preview-fallback rounded-lg pa-4 text-center mx-auto" style="max-width: 400px;">
                        <v-icon size="32" color="amber-accent-2" class="mb-1">mdi-cards</v-icon>
                        <div class="text-caption text-grey-lighten-1">Gift Item Cards (80x)</div>
                      </div>
                    </template>
                  </v-img>
                </div>
              </div>

              <!-- 2.2 -->
              <div class="substep-block mb-5">
                <h3 class="substep-heading font-weight-bold text-white mb-2">
                  2.2 – Rescue the Pet Cards <span class="text-amber-accent-2 text-caption font-weight-bold ml-1">(Special Step!)</span>
                </h3>
                <p class="intro-p text-white mb-3">
                  Go back to the pile of components you <strong class="text-white font-weight-bold">set aside</strong> from the Core Box, open the appropriate card pack, and <strong class="text-white font-weight-bold">retrieve Maya’s 2 Pet Cards</strong> (<strong class="text-white font-weight-bold">Wolf and Eagle</strong>). Add them to the components that will be used.
                </p>
                
                <div 
                  class="checklist-row d-flex align-start py-2.5 cursor-pointer mb-1"
                  :class="{ 'row-checked': isChecked('step2_2_pet_cards') }"
                  @click="handleItemClick({ id: 'step2_2_pet_cards', title: 'Maya\'s Pet Cards (Wolf & Eagle)', image: getImg('Pets Maya.png') })"
                >
                  <div 
                    class="custom-checkbox flex-shrink-0" 
                    :class="{ 'checked': isChecked('step2_2_pet_cards') }"
                    @click.stop="handleItemClick({ id: 'step2_2_pet_cards', title: 'Maya\'s Pet Cards (Wolf & Eagle)', image: getImg('Pets Maya.png') })"
                  ></div>
                  <span class="row-label text-white flex-grow-1">
                    Retrieve Maya's 2 Pet Cards (Wolf and Eagle) and add to active components.
                  </span>
                </div>

                <!-- Pet Cards Image -->
                <div class="text-center my-3">
                  <v-img
                    :src="getImg('Pets Maya.png')"
                    alt="Maya's Pet Cards - Wolf and Eagle"
                    max-width="380"
                    class="mx-auto rounded-lg cursor-pointer"
                    @click="openModal({ id: 'step2_2_pet_cards', title: 'Maya\'s Pet Cards (Wolf & Eagle)', image: getImg('Pets Maya.png') })"
                  >
                    <template v-slot:error>
                      <div class="pet-preview-fallback rounded-lg pa-4 text-center mx-auto d-flex justify-center ga-4" style="max-width: 380px;">
                        <div class="text-caption text-grey-lighten-1"><v-icon size="small" color="cyan-accent-3">mdi-owl</v-icon> Eagle Pet Card</div>
                        <div class="text-caption text-grey-lighten-1"><v-icon size="small" color="cyan-accent-3">mdi-dog</v-icon> Wolf Pet Card</div>
                      </div>
                    </template>
                  </v-img>
                </div>
              </div>

              <!-- 2.3 Organizing Kit's Mini USA Cards -->
              <div class="substep-block mb-5">
                <h3 class="substep-heading font-weight-bold text-white mb-2">
                  2.3 – Organizing the Kit’s Mini USA Cards:
                </h3>
                <p class="intro-p text-white mb-3">
                  Sort the cards into separate piles by category: <strong class="text-white font-weight-bold">Heroes, Enemies, and Adventures</strong>.
                </p>

                <!-- Table Matching Image 3 (Scrollable with 3rd column peek and visible scrollbar) -->
                <div class="cards-table-wrapper mb-2 overflow-x-auto">
                  <v-table theme="dark" class="mini-cards-table rounded-lg" style="min-width: 680px;">
                    <thead>
                      <tr>
                        <th class="text-center text-caption font-weight-bold text-white bg-grey-darken-3 py-3 border-col-right text-uppercase" style="width: 226px; min-width: 226px;">
                          HERO COMPONENTS
                        </th>
                        <th class="text-center text-caption font-weight-bold text-white bg-grey-darken-3 py-3 border-col-right text-uppercase" style="width: 226px; min-width: 226px;">
                          ENEMY COMPONENTS
                        </th>
                        <th class="text-center text-caption font-weight-bold text-white bg-grey-darken-3 py-3 text-uppercase" style="width: 228px; min-width: 228px;">
                          ADVENTURE COMPONENTS
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="rowIndex in maxCardRows" :key="rowIndex" class="table-row-custom">
                        <!-- Hero -->
                        <td class="table-cell-custom pa-3 align-top border-col-right text-center" style="width: 226px; min-width: 226px;">
                          <div 
                            v-if="heroCards[rowIndex - 1]" 
                            class="cell-check-item d-flex flex-column align-center justify-space-between pa-1 rounded cursor-pointer fill-height"
                            :class="{ 'cell-checked': isChecked(heroCards[rowIndex - 1].id) }"
                            @click="handleItemClick(heroCards[rowIndex - 1])"
                          >
                            <span class="text-caption text-white style-table-text mb-2 text-center">{{ heroCards[rowIndex - 1].label }}</span>
                            <div 
                              class="custom-checkbox flex-shrink-0 ma-0" 
                              :class="{ 'checked': isChecked(heroCards[rowIndex - 1].id) }"
                              @click.stop="handleItemClick(heroCards[rowIndex - 1])"
                            ></div>
                          </div>
                        </td>

                        <!-- Enemy -->
                        <td class="table-cell-custom pa-3 align-top border-col-right text-center" style="width: 226px; min-width: 226px;">
                          <div 
                            v-if="enemyCards[rowIndex - 1]" 
                            class="cell-check-item d-flex flex-column align-center justify-space-between pa-1 rounded cursor-pointer fill-height"
                            :class="{ 'cell-checked': isChecked(enemyCards[rowIndex - 1].id) }"
                            @click="handleItemClick(enemyCards[rowIndex - 1])"
                          >
                            <span class="text-caption text-white style-table-text mb-2 text-center">{{ enemyCards[rowIndex - 1].label }}</span>
                            <div 
                              class="custom-checkbox flex-shrink-0 ma-0" 
                              :class="{ 'checked': isChecked(enemyCards[rowIndex - 1].id) }"
                              @click.stop="handleItemClick(enemyCards[rowIndex - 1])"
                            ></div>
                          </div>
                        </td>

                        <!-- Adventure -->
                        <td class="table-cell-custom pa-3 align-top text-center" style="width: 228px; min-width: 228px;">
                          <div 
                            v-if="adventureCards[rowIndex - 1]" 
                            class="cell-check-item d-flex flex-column align-center justify-space-between pa-1 rounded cursor-pointer fill-height"
                            :class="{ 'cell-checked': isChecked(adventureCards[rowIndex - 1].id) }"
                            @click="handleItemClick(adventureCards[rowIndex - 1])"
                          >
                            <span class="text-caption text-white style-table-text mb-2 text-center">{{ adventureCards[rowIndex - 1].label }}</span>
                            <div 
                              class="custom-checkbox flex-shrink-0 ma-0" 
                              :class="{ 'checked': isChecked(adventureCards[rowIndex - 1].id) }"
                              @click.stop="handleItemClick(adventureCards[rowIndex - 1])"
                            ></div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>

                <!-- Scroll Indicator Cue for Mobile -->
                <div class="d-flex align-center justify-center ga-1.5 mt-1 mb-4 text-caption text-grey-lighten-1 font-weight-medium d-sm-none">
                  <v-icon size="small" color="cyan-accent-3">mdi-arrow-left-right</v-icon>
                  <span>Scroll sideways to view ADVENTURE COMPONENTS</span>
                </div>

                <p class="intro-p text-white mb-3">
                  Place each of these <strong class="text-white font-weight-bold">3 categories</strong> into one of the <strong class="text-white font-weight-bold">3 Save Game Boxes</strong> that are still empty.
                </p>

                <!-- 3 Save Game Boxes Image -->
                <div class="text-center my-4">
                  <v-img
                    :src="getImg('Hero_Enemy_Adventure components.png')"
                    alt="3 Save Game Boxes Layout"
                    max-width="400"
                    class="mx-auto rounded-lg cursor-pointer"
                    @click="openModal({ id: 'save_boxes_layout', title: '3 Save Game Boxes Layout', image: getImg('Hero_Enemy_Adventure components.png') })"
                  >
                    <template v-slot:error>
                      <div class="save-boxes-fallback rounded-lg pa-5 text-center mx-auto" style="max-width: 400px;">
                        <v-icon size="36" color="cyan-accent-3" class="mb-1">mdi-archive-outline</v-icon>
                        <div class="text-caption text-grey-lighten-1">Place categories into the 3 empty Save Game Boxes</div>
                      </div>
                    </template>
                  </v-img>
                </div>
              </div>

              <!-- 2.4 -->
              <div class="substep-block">
                <h3 class="substep-heading font-weight-bold text-white mb-2">
                  2.4 – Packing Everything Back into the Core Box
                </h3>
                <p class="intro-p text-white mb-3">
                  Now, return the following components to the <strong class="text-white font-weight-bold">Core Box</strong>:
                </p>
                <div class="checklist-items">
                  <div 
                    v-for="item in step2PackItems" 
                    :key="item.id"
                    class="checklist-row d-flex align-start py-2.5 cursor-pointer mb-1"
                    :class="{ 'row-checked': isChecked(item.id) }"
                    @click="handleItemClick(item)"
                  >
                    <div 
                      class="custom-checkbox flex-shrink-0" 
                      :class="{ 'checked': isChecked(item.id) }"
                      @click.stop="handleItemClick(item)"
                    ></div>
                    <span class="row-label text-white flex-grow-1" v-html="item.label"></span>
                  </div>
                </div>
              </div>
            </div>
          </v-expand-transition>
        </div>

        <!-- ================= STEP 3 ================= -->
        <div class="step-section mb-4">
          <!-- Step Banner Header -->
          <div 
            class="step-banner rounded-lg d-flex align-center cursor-pointer"
            :class="{ 'banner-open': openSteps[3] }"
            @click="toggleStep(3)"
          >
            <span class="step-badge badge-step-3">STEP 3</span>
            <h2 class="step-title single-line-title font-weight-bold text-white pl-3 pr-3 py-2.5 flex-grow-1">
              The “Build Your Own Dungeon” Add-On
            </h2>
          </div>

          <!-- Expandable Content for Step 3 with Grey Background -->
          <v-expand-transition>
            <div v-show="openSteps[3]" class="step-open-container pt-4 pb-4 px-3 px-sm-5 mb-4">
              <p class="intro-p text-white mb-5">
                Open the add-on box and <strong class="text-white font-weight-bold">Set Aside</strong> the plastic wraps containing the <strong class="text-white font-weight-bold">Map Tiles</strong>.
              </p>

              <!-- BYOD Box Image -->
              <div class="text-center my-5">
                <v-img
                  :src="getImg('Build Your Own Dungeon.png')"
                  alt="Build Your Own Dungeon Add-On Box"
                  max-width="280"
                  class="mx-auto rounded-lg cursor-pointer shadow-elevation-8"
                  @click="openModal({ id: 'byod_box', title: 'Build Your Own Dungeon Add-On', image: getImg('Build Your Own Dungeon.png') })"
                >
                  <template v-slot:error>
                    <div class="byod-fallback rounded-lg pa-5 text-center mx-auto" style="max-width: 280px;">
                      <v-icon size="40" color="amber-accent-2" class="mb-1">mdi-castle</v-icon>
                      <div class="text-caption font-weight-bold text-white">Build Your Own Dungeon Add-On</div>
                    </div>
                  </template>
                </v-img>
              </div>

              <!-- 3.1 -->
              <div class="substep-block">
                <h3 class="substep-heading font-weight-bold text-white mb-2">
                  3.1 – What to do:
                </h3>
                
                <div class="checklist-items">
                  <div 
                    class="checklist-row d-flex align-start py-2.5 cursor-pointer mb-1"
                    :class="{ 'row-checked': isChecked('step3_1_dungeon_trays') }"
                    @click="handleItemClick({ id: 'step3_1_dungeon_trays', label: 'Pack 5 Dungeon Trays vertically inside Core Box', image: getImg('5 New Trays.png'), title: '5 Dungeon Trays Vertically Positioned' })"
                  >
                    <div 
                      class="custom-checkbox flex-shrink-0" 
                      :class="{ 'checked': isChecked('step3_1_dungeon_trays') }"
                      @click.stop="handleItemClick({ id: 'step3_1_dungeon_trays', label: 'Pack 5 Dungeon Trays vertically inside Core Box', image: getImg('5 New Trays.png'), title: '5 Dungeon Trays Vertically Positioned' })"
                    ></div>
                    <span class="row-label text-white flex-grow-1">
                      <strong class="text-white font-weight-bold">Pack into the Core Box:</strong> Take the <strong class="text-white font-weight-bold">5 new Dungeon Trays</strong> and place them inside the Core Box. Position them <strong class="text-white font-weight-bold">vertically</strong> so they fit.
                    </span>
                  </div>

                  <!-- Dungeon Trays Vertical Placement Image -->
                  <div class="text-center my-3">
                    <v-img
                      :src="getImg('5 New Trays.png')"
                      alt="5 New Dungeon Trays Positioned Vertically"
                      max-width="400"
                      class="mx-auto rounded-lg cursor-pointer"
                      @click="openModal({ id: 'step3_1_dungeon_trays', title: '5 Dungeon Trays Vertically Positioned', image: getImg('5 New Trays.png') })"
                    >
                      <template v-slot:error>
                        <div class="trays-fallback rounded-lg pa-5 text-center mx-auto" style="max-width: 400px;">
                          <v-icon size="36" color="cyan-accent-3" class="mb-1">mdi-view-grid-plus</v-icon>
                          <div class="text-caption text-grey-lighten-1">Position 5 Dungeon Trays vertically inside the box</div>
                        </div>
                      </template>
                    </v-img>
                  </div>

                  <div 
                    class="checklist-row d-flex align-start py-2.5 cursor-pointer mb-1"
                    :class="{ 'row-checked': isChecked('step3_1_gift_cards') }"
                    @click="handleItemClick({ id: 'step3_1_gift_cards', title: 'Gift Item Cards', image: getImg('GIFT CARDS.png') })"
                  >
                    <div 
                      class="custom-checkbox flex-shrink-0" 
                      :class="{ 'checked': isChecked('step3_1_gift_cards') }"
                      @click.stop="handleItemClick({ id: 'step3_1_gift_cards', title: 'Gift Item Cards', image: getImg('GIFT CARDS.png') })"
                    ></div>
                    <span class="row-label text-white flex-grow-1">
                      Place the stack of <strong class="text-white font-weight-bold">Gift Cards</strong> inside the Core Box as well.
                    </span>
                  </div>

                  <div 
                    class="checklist-row d-flex align-start py-2.5 cursor-pointer mb-1"
                    :class="{ 'row-checked': isChecked('step3_1_close_box') }"
                    @click="handleItemClick({ id: 'step3_1_close_box', title: 'Core Box Fully Closed', image: getImg('Drunagor Nights Box.png') })"
                  >
                    <div 
                      class="custom-checkbox flex-shrink-0" 
                      :class="{ 'checked': isChecked('step3_1_close_box') }"
                      @click.stop="handleItemClick({ id: 'step3_1_close_box', title: 'Core Box Fully Closed', image: getImg('Drunagor Nights Box.png') })"
                    ></div>
                    <span class="row-label text-white flex-grow-1">
                      Put the lid on and <strong class="text-white font-weight-bold">close the Core Box!</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </v-expand-transition>
        </div>

        <!-- ================= STEP 4 ================= -->
        <div class="step-section mb-4">
          <!-- Step Banner Header -->
          <div 
            class="step-banner rounded-lg d-flex align-center cursor-pointer"
            :class="{ 'banner-open': openSteps[4] }"
            @click="toggleStep(4)"
          >
            <span class="step-badge badge-step-4">STEP 4</span>
            <h2 class="step-title single-line-title font-weight-bold text-white pl-3 pr-3 py-2.5 flex-grow-1">
              Clean-Up and You’re Done!
            </h2>
          </div>

          <!-- Expandable Content for Step 4 matching input_file_0.png -->
          <v-expand-transition>
            <div v-show="openSteps[4]" class="step-open-container pt-4 pb-4 px-4 px-sm-5 mb-4">
              <p class="intro-p text-white mb-4">
                That’s it! Your <strong class="text-white font-weight-bold">Core Box</strong> is now fully optimized and ready for <strong class="text-white font-weight-bold">Drunagor Nights</strong>.
              </p>

              <p class="intro-p text-white mb-4">
                Take all the components you <strong class="text-white font-weight-bold">set aside</strong> during the previous steps and place them inside the now-empty <strong class="text-white font-weight-bold">Organized Play Kit box.</strong>
              </p>

              <p class="intro-p text-white mb-5">
                Store that box somewhere safe, as you may want to use the original Heroes or some of those components again in the future.
              </p>

              <div class="py-1">
                <span class="step4-enjoy-text font-weight-bold text-white">
                  Enjoy the game!
                </span>
              </div>
            </div>
          </v-expand-transition>
        </div>

        <!-- Bottom Back Button -->
        <div class="d-flex justify-center mt-6">
          <v-btn
            color="amber-accent-2"
            variant="outlined"
            rounded="pill"
            size="medium"
            class="font-weight-black text-white px-6 transition-swing"
            prepend-icon="mdi-arrow-left"
            @click="router.push({ name: 'RetailerTutorial' })"
            style="border-width: 2px;"
          >
            Back to Retailer Guide
          </v-btn>
        </div>

      </v-card>
    </v-container>

    <!-- Inspection Item Modal -->
    <v-dialog v-model="modalOpen" max-width="460" scrollable class="item-detail-dialog">
      <v-card color="#232323" class="rounded-xl overflow-hidden pa-0 modal-card" elevation="24">
        <!-- Dialog Title Bar Centered -->
        <div class="pa-4 pt-5 text-center">
          <h3 class="text-subtitle-1 font-weight-bold text-white pa-0 ma-0">
            {{ activeModalItem.title || 'Item Inspection' }}
          </h3>
        </div>

        <!-- Image Content Container -->
        <v-card-text class="pa-4 d-flex flex-column align-center justify-center" style="min-height: 240px;">
          <v-img
            v-if="activeModalItem.image"
            :src="activeModalItem.image"
            width="100%"
            contain
            max-height="50vh"
            class="rounded-lg"
          >
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height bg-grey-darken-4 rounded-lg">
                <v-progress-circular indeterminate color="cyan-accent-3" size="32"></v-progress-circular>
              </div>
            </template>
            <template v-slot:error>
              <div class="d-flex flex-column align-center justify-center pa-8 bg-grey-darken-4 text-center rounded-lg w-100 fill-height">
                <v-icon size="48" color="amber-accent-2" class="mb-3">mdi-book-open-page-variant</v-icon>
                <div class="text-subtitle-2 font-weight-bold text-white mb-1">{{ activeModalItem.title }}</div>
                <div class="text-caption text-grey-lighten-1">Illustration component preview</div>
              </div>
            </template>
          </v-img>
          
          <div v-else class="py-6 text-center">
            <v-icon size="40" color="amber-accent-2" class="mb-2">mdi-information-outline</v-icon>
            <div class="text-body-2 text-white font-weight-medium mb-1">{{ activeModalItem.title }}</div>
          </div>
        </v-card-text>

        <!-- Action Button Bar matching input_file_0.png -->
        <div class="pa-0 ma-0">
          <v-btn
            block
            size="large"
            variant="flat"
            class="font-weight-bold text-white py-3 rounded-0"
            :class="activeModalIsChecked ? 'mark-done-btn' : 'not-done-btn'"
            style="height: 52px;"
            @click="toggleActiveModalCheckOnly"
          >
            <v-icon start size="medium" class="mr-2">
              {{ activeModalIsChecked ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
            </v-icon>
            {{ activeModalIsChecked ? 'Checked as Done' : 'Not Done' }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const STORAGE_KEY = 'drunagor_box_assembly_checks';
const BASE_IMG_URL = 'https://assets.drunagor.app/retaitlertutorial/box-assembly-guide/';

// Helper to construct exact image URL with space encoding
const getImg = (filename: string) => {
  if (!filename) return '';
  return `${BASE_IMG_URL}${encodeURIComponent(filename)}`;
};

// Reactive map storing checked states by item ID
const checkedItems = ref<Record<string, boolean>>({});

// Collapsible steps state (All steps come CLOSED by default as requested!)
const openSteps = ref<Record<number, boolean>>({
  1: false,
  2: false,
  3: false,
  4: false,
});

// Toggle collapsible step open/close
const toggleStep = (stepNumber: number) => {
  openSteps.value[stepNumber] = !openSteps.value[stepNumber];
};

// Modal state
const modalOpen = ref(false);
const activeModalItem = ref<{ id?: string; title?: string; image?: string }>({});

// Helper: Check if item is checked
const isChecked = (id: string): boolean => {
  return !!checkedItems.value[id];
};

// Helper: Toggle item check state and persist
const toggleCheck = (id: string) => {
  if (!id) return;
  checkedItems.value[id] = !checkedItems.value[id];
  saveToLocalStorage();
};

// Handle clicking on an item line:
// If item has an image/detail modal, open the modal dialog!
// Otherwise, directly toggle the check state.
const handleItemClick = (item: { id: string; label?: string; title?: string; image?: string }) => {
  if (item.image) {
    openModal(item);
  } else {
    toggleCheck(item.id);
  }
};

// Save to LocalStorage
const saveToLocalStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedItems.value));
  } catch (e) {
    console.error('Failed to save box assembly state to localStorage:', e);
  }
};

// Load from LocalStorage
const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      checkedItems.value = JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load box assembly state from localStorage:', e);
  }
};

// Open detail modal
const openModal = (item: { id?: string; label?: string; title?: string; image?: string }) => {
  activeModalItem.value = {
    id: item.id,
    title: item.title || (item.label ? item.label.replace(/<[^>]*>/g, '') : ''),
    image: item.image,
  };
  modalOpen.value = true;
};

// Computed for modal action button state
const activeModalIsChecked = computed(() => {
  if (!activeModalItem.value.id) return false;
  return isChecked(activeModalItem.value.id);
});

// Toggle check from inside modal (stays open for user feedback until clicking outside)
const toggleActiveModalCheckOnly = () => {
  if (activeModalItem.value.id) {
    toggleCheck(activeModalItem.value.id);
  }
};

onMounted(() => {
  loadFromLocalStorage();
});

// Item Definitions with exact S3 image URLs from user folder mapping
const step1SetAsideItems = [
  {
    id: 'step1_1_adventure_books',
    label: 'The <strong class="text-white font-weight-bold">Adventure Book</strong> and <strong class="text-white font-weight-bold">Interaction Book</strong>.',
    image: getImg('Adventure Book and Interaction Book.png'),
    title: 'The Adventure Book and Interaction Book'
  },
  {
    id: 'step1_1_campaign_log',
    label: 'The <strong class="text-white font-weight-bold">Campaign Log</strong>.',
    image: getImg('Campaign log pad.png'),
    title: 'Campaign Log'
  },
  {
    id: 'step1_1_start_here',
    label: 'The <strong class="text-white font-weight-bold">“Start Here” Booklet</strong>.',
    image: getImg('Start Here.png'),
    title: 'The “Start Here” Booklet'
  },
  {
    id: 'step1_1_doors',
    label: 'The plastic wrap containing the <strong class="text-white font-weight-bold">Doors</strong>.',
    image: getImg('Doors Pack.png'),
    title: 'Doors Pack'
  },
  {
    id: 'step1_1_hero_boards',
    label: 'All original <strong class="text-white font-weight-bold">Hero Boards</strong> from the Core Box.',
    image: getImg('PLAYERBOARDS_CORE.png'),
    title: 'Hero Boards'
  },
  {
    id: 'step1_1_mini_cards',
    label: 'The packs of <strong class="text-white font-weight-bold">Mini American Cards</strong> found inside the <strong class="text-white font-weight-bold">Save Game Boxes</strong>. Empty the boxes, but <strong class="text-white font-weight-bold">keep them nearby!</strong>',
    image: getImg('Save Game Box Empty.png'),
    title: 'Save Game Box'
  }
];

const step1SeparateItems = [
  {
    id: 'step1_2_rulebook',
    label: '<strong class="text-white font-weight-bold">Rulebook</strong>.',
    image: getImg('Rulebook.png'),
    title: 'Rulebook'
  },
  {
    id: 'step1_2_map_tiles',
    label: '<strong class="text-white font-weight-bold">Map Tiles</strong>.',
    image: getImg('Map Tiles CORE.png'),
    title: 'Map Tiles'
  },
  {
    id: 'step1_2_velvet_bag',
    label: '<strong class="text-white font-weight-bold">Velvet Bag</strong>.',
    image: getImg('Velvet BAG.png'),
    title: 'Velvet Bag'
  },
  {
    id: 'step1_2_punchboards',
    label: 'All <strong class="text-white font-weight-bold">Punchboards</strong>.',
    image: getImg('Punchboards.png'),
    title: 'Punchboards'
  },
  {
    id: 'step1_2_save_boxes',
    label: 'The <strong class="text-white font-weight-bold">6 Save Game Boxes</strong> (1 with the colored bases still inside and the other 5 now empty).',
    image: getImg('Snap Box.png'),
    title: 'Save Game Boxes'
  },
  {
    id: 'step1_2_monster_boards',
    label: 'The <strong class="text-white font-weight-bold">2 Monster Status Boards</strong>.',
    image: getImg('Monster Status Boards.png'),
    title: 'Monster Status Boards'
  },
  {
    id: 'step1_2_trays',
    label: '<strong class="text-white font-weight-bold">All trays:</strong> Darkness Tiles, Tokens, Small Miniatures, and Dungeon Tiles.',
    image: getImg('Small Miniature Tray.png'),
    title: 'All Trays'
  },
  {
    id: 'step1_2_cubes_bag',
    label: 'The bag containing the <strong class="text-white font-weight-bold">colored cubes</strong>.',
    image: getImg('Colored Cubes.png'),
    title: 'Colored Cubes'
  }
];

const step1OrganizeItems = [
  {
    id: 'step1_3_trays_order',
    label: '<strong class="text-white font-weight-bold">Trays:</strong> Return the <strong class="text-white font-weight-bold">Small Miniatures Tray</strong> and the <strong class="text-white font-weight-bold">Dungeon Trays</strong> to the box. (Order: <strong class="text-white font-weight-bold">Tray 1</strong> on the bottom, <strong class="text-white font-weight-bold">Tray 2</strong> in the middle, and <strong class="text-white font-weight-bold">Tray 3</strong> on top.)',
    image: getImg('Dungeon Trayz.png'),
    title: 'Dungeon Trays & Small Miniature Tray'
  },
  {
    id: 'step1_3_cubes_sort',
    label: '<strong class="text-white font-weight-bold">Colored Cubes:</strong> Sort them into the empty <strong class="text-white font-weight-bold">Save Game Boxes</strong>.',
    image: getImg('Colored Cubes.png'),
    title: 'Colored Cubes Sorting',
    details: [
      {
        id: 'step1_3_box_a',
        label: '<strong class="text-white font-weight-bold">Box A:</strong> Place the <strong class="text-white font-weight-bold">Yellow and Red Cubes</strong> in one compartment, and the <strong class="text-white font-weight-bold">Green and Blue Cubes</strong> in the other. Place the <strong class="text-white font-weight-bold">two dice</strong> in the narrow space between the compartments.',
        image: getImg('CUBE Tray 1.png'),
        title: 'BOX A - Cubes & Dice'
      },
      {
        id: 'step1_3_box_b',
        label: '<strong class="text-white font-weight-bold">Box B:</strong> Place the <strong class="text-white font-weight-bold">Black Cubes</strong> in one compartment and the <strong class="text-white font-weight-bold">White Cubes</strong> in the other. Place the <strong class="text-white font-weight-bold">Purple and Pink Cubes</strong> in the narrow space between the compartments.',
        image: getImg('CUBE Tray 2.png'),
        title: 'BOX B - Cubes'
      }
    ]
  },
  {
    id: 'step1_3_cardboard',
    label: '<strong class="text-white font-weight-bold">Cardboard Components (Punchboards):</strong> Punch out all components.',
    image: getImg('Punchboards.png'),
    title: 'Cardboard Components',
    details: [
      {
        id: 'step1_3_darkness_tray',
        label: '<strong class="text-white font-weight-bold">Darkness Tiles:</strong> Place them in the <strong class="text-white font-weight-bold">Darkness Tile Tray</strong>, then return the tray to the box.',
        image: getImg('Darkness Tray Fullfiled.png'),
        title: 'Darkness Tray'
      },
      {
        id: 'step1_3_runes',
        label: '<strong class="text-white font-weight-bold">Runes:</strong> Place them inside the <strong class="text-white font-weight-bold">Velvet Bag</strong>.',
        image: getImg('Rune Bag.png'),
        title: 'Rune Bag'
      },
      {
        id: 'step1_3_tokens',
        label: '<strong class="text-white font-weight-bold">Tokens:</strong> Place them in the <strong class="text-white font-weight-bold">Token Tray</strong>. Any tokens that do not fit should go into the plastic bag that held the cubes and be <strong class="text-white font-weight-bold">set aside</strong>. Return the tray to the box.',
        image: getImg('Tokens Tray Fullfiled.png'),
        title: 'Token Tray'
      },
      {
        id: 'step1_3_initiative',
        label: '<strong class="text-white font-weight-bold">Initiative Track and Bridges:</strong> <strong class="text-white font-weight-bold">Keep them nearby.</strong>',
        image: getImg('Initiative Bridge.png'),
        title: 'Initiative Track and Bridges'
      }
    ]
  }
];

const step2SeparateItems = [
  {
    id: 'step2_1_hero_boards',
    label: '<strong class="text-white font-weight-bold">Hero Boards</strong> from the Kit.',
    image: getImg('PLAYERBOARDS_DNS1.png'),
    title: 'Hero Boards (Kit)'
  },
  {
    id: 'step2_1_map_tiles',
    label: '<strong class="text-white font-weight-bold">Map Tiles</strong>.',
    image: getImg('Map Tiles DNS1.png'),
    title: 'Map Tiles (Kit)'
  },
  { 
    id: 'step2_1_gift_cards', 
    label: '<strong class="text-white font-weight-bold">Gift Item Cards (80x):</strong> Set them aside and, if possible, assemble the Gift Packs with one of each Gift card in them.',
    image: getImg('GIFT CARDS.png'),
    title: 'Gift Item Cards (80x)'
  }
];

// Mini Cards Table Data
const heroCards = [
  { id: 'step2_3_h1', label: '5x Hero Initiative Cards (1 per Hero)', image: getImg('Hero Initiative Cards DNS1.png'), title: 'Hero Initiative Cards' },
  { id: 'step2_3_h2', label: '20x Hero Skill Cards (4 per Hero)', image: getImg('Hero Skills Cards DNS1.png'), title: 'Hero Skill Cards' },
  { id: 'step2_3_h3', label: '20x Class Skill Cards (4 per Class)', image: getImg('Class Skill Cards DNS1.png'), title: 'Class Skill Cards' },
  { id: 'step2_3_h4', label: '10x Themed Starting Equipment Cards (2 per Hero)', image: getImg('Hero Starting Gear Cards DNS1.png'), title: 'Hero Starting Gear Cards' },
  { id: 'step2_3_h5', label: '10x Party Role Cards (2 per Role)', image: getImg('Dungeon Role Cards DNS1.png'), title: 'Dungeon Role Cards' }
];

const enemyCards = [
  { id: 'step2_3_e1', label: '28x Monster Cards (White, Gray, and Black)', image: getImg('Monsters Cards DNS1.png'), title: 'Monster Cards' },
  { id: 'step2_3_e2', label: '3x Commander Cards', image: getImg('Commanders Cards DNS1.png'), title: 'Commander Cards' },
  { id: 'step2_3_e3', label: '1x Boss Card', image: getImg('Boss Cards DNS1.png'), title: 'Boss Card' },
  { id: 'step2_3_e4', label: '1x Minion Card', image: getImg('Minions Cards DNS1.png'), title: 'Minion Card' },
  { id: 'step2_3_e5', label: '10x Commander Attack Cards', image: getImg('Commander Attack Cards DNS1.png'), title: 'Commander Attack Cards' },
  { id: 'step2_3_e6', label: '8x Boss Attack Cards', image: getImg('Boss Attack Cards DNS1.png'), title: 'Boss Attack Cards' }
];

const adventureCards = [
  { id: 'step2_3_a1', label: '22x Adventure Item Cards', image: getImg('Adventure Cards DNS1.png'), title: 'Adventure Item Cards' },
  { id: 'step2_3_a2', label: '18x Chest Cards', image: getImg('Chest Cards DNS1.png'), title: 'Chest Item Cards' },
  { id: 'step2_3_a3', label: '3x Tutorial Trigger Cards', image: getImg('Tutorial Trigger Cards DNS1.png'), title: 'Tutorial Trigger Cards' },
  { id: 'step2_3_a4', label: '2x Scene Trigger Cards', image: getImg('Scene Trigger Cards DNS1.png'), title: 'Scene Trigger Cards' },
  { id: 'step2_3_a5', label: '2x Rune Cards', image: getImg('Rune Cards DNS1.png'), title: 'Rune Cards' },
  { id: 'step2_3_a6', label: '2x Game Mechanic Cards', image: getImg('Game Mechenics Cards DNS1.png'), title: 'Game Mechanic Cards' },
  { id: 'step2_3_a7', label: '1x End of Round Trigger Card', image: getImg('End of Round Trigger Cards DNS1.png'), title: 'End of Round Trigger Cards' },
  { id: 'step2_3_a8', label: '1x Game Status Check Card', image: getImg('Game State Check-up Cards DNS1.png'), title: 'Game State Check-up Cards' }
];

const maxCardRows = Math.max(heroCards.length, enemyCards.length, adventureCards.length);

const step2PackItems = [
  {
    id: 'step2_4_save_boxes',
    label: 'All <strong class="text-white font-weight-bold">6 Save Game Boxes</strong> (now fully packed).',
    image: getImg('The 6 Save Game Boxes.png'),
    title: 'The 6 Save Game Boxes'
  },
  {
    id: 'step2_4_velvet_bag',
    label: 'The <strong class="text-white font-weight-bold">Velvet Bag</strong> containing the Runes.',
    image: getImg('Rune Bag.png'),
    title: 'Rune Bag'
  },
  {
    id: 'step2_4_initiative',
    label: 'The <strong class="text-white font-weight-bold">Initiative Track</strong> and <strong class="text-white font-weight-bold">Bridges</strong>.',
    image: getImg('Initiative Bridge.png'),
    title: 'Initiative Track and Bridges'
  },
  {
    id: 'step2_4_map_tiles',
    label: 'All <strong class="text-white font-weight-bold">Map Tiles</strong> (combining those from the Kit with those from the Core Box).',
    image: getImg('Map Tiles DNS1.png'),
    title: 'All Map Tiles'
  },
  {
    id: 'step2_4_hero_boards',
    label: 'The <strong class="text-white font-weight-bold">Hero Boards</strong> from the Kit.',
    image: getImg('PLAYERBOARDS_DNS1.png'),
    title: 'Hero Boards'
  },
  {
    id: 'step2_4_rulebook',
    label: 'The <strong class="text-white font-weight-bold">Rulebook</strong>.',
    image: getImg('Rulebook.png'),
    title: 'Rulebook'
  }
];
</script>

<style scoped>
.safe-area-padding {
  padding-top: calc(env(safe-area-inset-top, 0px) + 20px) !important;
}

.box-assembly-page-wrapper {
  position: relative;
  width: 100%;
  overflow-x: hidden;
  min-height: 100vh;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 300;
}

.page-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  background-image: 
    radial-gradient(circle at 50% 0%, rgba(20, 20, 20, 0.98) 0%, rgba(20, 20, 20, 0.85) 25%, rgba(20, 20, 20, 0) 65%),
    url('https://assets.drunagor.app/backgrounds/mblogin-background.png');
  background-size: cover, cover;
  background-position: top center, top center;
  background-repeat: no-repeat, no-repeat;
}

@media (min-width: 960px) {
  .page-background {
    background-image: 
      radial-gradient(circle at 50% 0%, rgba(20, 20, 20, 0.98) 0%, rgba(20, 20, 20, 0.85) 25%, rgba(20, 20, 20, 0) 65%),
      url('https://s3.us-east-2.amazonaws.com/assets.drunagor.app/backgrounds/bg-login.webp');
  }
}

.guide-container {
  position: relative;
  z-index: 1;
}

.main-header-title {
  font-family: 'Poppins', sans-serif !important;
  font-size: 1.8rem;
  line-height: 1.1;
  letter-spacing: 0.5px;
  font-weight: 800;
}

@media (min-width: 600px) {
  .main-header-title {
    font-size: 2.5rem;
  }
}

.subtitle-text {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.45) !important;
  max-width: 560px;
  line-height: 1.45;
  font-weight: 300;
}

.pdf-guide-link {
  color: #BCA341 !important;
  font-weight: 600;
  text-decoration: underline !important;
  transition: color 0.2s ease, text-shadow 0.2s ease;
  display: inline-flex;
  align-items: center;
  margin-left: 3px;
}

.pdf-guide-link:hover {
  color: #d8bd4f !important;
  text-shadow: 0 0 8px rgba(188, 163, 65, 0.4);
}

/* Single Main Box Card */
.main-box-card {
  background: #232323 !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 12px 36px rgba(0,0,0,0.6) !important;
}

/* Step Banner Header */
.step-banner {
  background: #181818;
  border-radius: 12px;
  width: 100%;
  overflow: hidden;
  transition: background 0.2s ease;
}

.step-banner:hover {
  background: #202020;
}

.banner-open {
  border-bottom-left-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
}

/* Step Open Grey Background Container matching input_file_0.png */
.step-open-container {
  background: #343434 !important;
  width: 100%;
  border-bottom-left-radius: 12px !important;
  border-bottom-right-radius: 12px !important;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-top: none;
}

/* Exact Hex Colors for Step Badges */
.step-badge {
  color: #ffffff;
  font-weight: 800;
  font-size: 0.95rem;
  padding: 11px 20px;
  letter-spacing: 0.5px;
  border-top-left-radius: 12px !important;
  border-bottom-left-radius: 0px !important;
  border-top-right-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

@media (min-width: 600px) {
  .step-badge {
    font-size: 1.05rem;
    padding: 12px 24px;
  }
}

.badge-step-1 {
  background: #108788 !important;
}

.badge-step-2 {
  background: #0BB574 !important;
}

.badge-step-3 {
  background: #BCA341 !important;
}

.badge-step-4 {
  background: #5D3C76 !important;
}

/* Single-line step titles with responsive clamp to prevent mobile truncation */
.single-line-title {
  font-family: 'Poppins', sans-serif !important;
  font-size: clamp(0.92rem, 3.5vw, 1.25rem) !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  font-weight: 700 !important;
}

@media (min-width: 600px) {
  .single-line-title {
    font-size: 1.25rem !important;
  }
}

.substep-heading {
  font-size: 0.9rem !important;
  font-weight: 600 !important;
}

.intro-p {
  font-size: 0.84rem !important;
  color: #ffffff !important;
  font-weight: 300 !important;
  line-height: 1.45;
}

/* Custom crisp white square checkbox */
.custom-checkbox {
  width: 15px;
  height: 15px;
  min-width: 15px;
  min-height: 15px;
  background-color: #ffffff;
  border-radius: 3px;
  margin-right: 12px;
  margin-top: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.4);
}

.custom-checkbox.checked {
  background-color: #00c853;
}

.custom-checkbox.checked::after {
  content: '';
  width: 4px;
  height: 8px;
  border: solid #ffffff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  margin-bottom: 2px;
}

.row-label {
  font-size: 0.82rem !important;
  color: #ffffff !important;
  line-height: 1.45;
  font-weight: 300 !important;
}

/* Checklist rows with larger vertical touch padding to prevent accidental clicks */
.checklist-row {
  transition: opacity 0.2s ease, background 0.15s ease;
  border-radius: 6px;
  padding-left: 6px;
  padding-right: 6px;
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}

.checklist-row:hover {
  background: rgba(255, 255, 255, 0.05);
}

.row-checked {
  opacity: 0.45;
}

.row-checked .row-label {
  text-decoration: line-through;
}

.note-text {
  font-size: 0.78rem !important;
  font-weight: 300 !important;
}

.sub-bullets {
  font-size: 0.78rem;
  color: #dddddd;
  font-weight: 300 !important;
}

/* Step 4 Enjoy text matching input_file_0.png */
.step4-enjoy-text {
  font-size: 0.95rem;
  font-weight: 700 !important;
}

/* Table matching input_file_2.png */
.cards-table-wrapper {
  max-width: 100%;
  overflow-x: auto !important;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 6px;
}

.cards-table-wrapper::-webkit-scrollbar {
  height: 6px !important;
  display: block !important;
}

.cards-table-wrapper::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.cards-table-wrapper::-webkit-scrollbar-thumb {
  background: #00b8d4;
  border-radius: 4px;
}

.cards-table-wrapper::-webkit-scrollbar-thumb:hover {
  background: #00e5ff;
}

.border-col-right {
  border-right: 1px solid rgba(255, 255, 255, 0.12) !important;
}

.style-table-text {
  font-size: 0.76rem !important;
  line-height: 1.3;
  color: #ffffff !important;
  font-weight: 300 !important;
}

.mini-cards-table {
  background: #363636 !important;
}

.mini-cards-table th {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
  font-weight: 600 !important;
}

.table-cell-custom {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.width-33 {
  width: 33.33%;
}

.cell-check-item {
  background: transparent;
  transition: all 0.2s ease;
}

.cell-check-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.cell-checked {
  opacity: 0.45;
  text-decoration: line-through;
}

.border-glow {
  border: 2px solid rgba(0, 229, 255, 0.4);
  transition: all 0.3s ease;
}

.border-glow:hover {
  border-color: rgba(0, 229, 255, 0.8);
  box-shadow: 0 0 16px rgba(0, 229, 255, 0.4);
  transform: scale(1.02);
}

.border-subtle {
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.border-subtle:hover {
  border-color: rgba(255, 215, 0, 0.4);
}

.back-button {
  background: rgba(255, 255, 255, 0.08) !important;
  transition: transform 0.3s ease, background-color 0.3s ease;
  z-index: 5;
}

.back-button:hover {
  transform: translateX(-4px);
  background: rgba(255, 255, 255, 0.15) !important;
}

.border-bottom-subtle {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.border-top-subtle {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.mark-done-btn {
  background-color: #00c853 !important;
  transition: background-color 0.2s ease;
}

.mark-done-btn:hover {
  background-color: #00e676 !important;
}

.not-done-btn {
  background-color: #4a4a4a !important;
  transition: background-color 0.2s ease;
}

.not-done-btn:hover {
  background-color: #555555 !important;
}

.box-preview-fallback,
.cards-preview-fallback,
.pet-preview-fallback,
.save-boxes-fallback,
.byod-fallback,
.trays-fallback {
  background: rgba(0, 0, 0, 0.4);
}
</style>
