<script setup>
import { bg, heros } from "~/core/manager/AssetsManager";
import { icons } from "~/core/manager/AssetsManager";
import { accessories } from "~/core/manager/AssetsManager";
</script>
<template>
  <v-sheet class="py-16" color="transparent">
    <div class="search-bg">

      <!-- <div class="decoration">
        <img :src="heros.hero_14" alt="" class="hero-img" />
      </div> -->

      <v-container>
        <v-row>
          <v-col cols="12" sm="10" md="7" class="mx-auto mx-md-0">
            <div class="track-section">
              <div class="position-relative d-flex">
                <BaseTitleSection :first="$t('track')" :second="$t('shipment')" />
                <v-img :src="accessories.acc_4" class="track-arrow-img"></v-img>
              </div>
              <div class="input-wrap d-flex ga-2">
                <v-text-field bg-color="rgba(var(--v-theme-primary),0.1) " class="text-input"
                  :placeholder="$t('enter_tracking_number')" variant="solo-filled"></v-text-field>
                <v-btn rounded="lg" :ripple="false" class="arrow-btn"> </v-btn>
              </div>
            </div>
          </v-col>
          <!-- <v-col cols="12" md="5">
            <v-sheet height="400" color="transparent" class="">
              <v-img class="" :src="heros.hero_14"></v-img>
            </v-sheet>
          </v-col> -->
        </v-row>
      </v-container>
    </div>
  </v-sheet>
</template>

<style lang="scss" scoped>
.search-bg {
  width: 100%;
  position: relative;

  @include media-breakpoint-up(lg) {
    min-height: 70vh;
  }

  &::before {
    content: '';
    width: 100%;
    height: 100%;
    background: url('@/assets/img/bg/bg-11.png') no-repeat bottom right;
    background-size: contain;
    position: absolute;
    top: 0;
    left: 0;
    display: none;

    @include media-breakpoint-up(lg) {
      display: block;
    }
  }

  .track-section {
    display: flex;
    flex-direction: column;
    gap: 100px;
    position: relative;
    // height: 400px;

    .track-arrow-img {
      width: 80px;
      height: 80px;
      // position: absolute;
      // top: 10px;
      // left: 350px;

      // @include media-breakpoint-up(xs) {
      //   top: 15px;
      //   left: 295px;
      // }
    }

    .input-wrap {
      width: 100%;


      // @include media-breakpoint-up(xs) {
      //   width: 100%;
      // }

      // @include media-breakpoint-up(sm) {
      //   width: 40%;
      // }

      // @include media-breakpoint-up(md) {
      //   width: 75%;
      // }



      .text-input {
        width: calc(100% - (57px));

        ::placeholder {
          font-size: 14px !important;
          font-weight: 600 !important;
          color: rgb(var(--v-theme-primary)) !important;

        }



      }

      .arrow-btn {
        width: 57px;
        height: 57px;
        background: url("@/assets/img/icons/arrow-btn.png") center no-repeat;
        background-size: 100% 100%;
      }

    }


  }

  [lang="ar"] & {

    &::before {
      content: '';
      width: 100%;
      height: 100%;
      background: url('@/assets/img/bg/bg-11.png') no-repeat bottom right;
      background-size: contain;
      position: absolute;
      top: 0;
      left: 0;
      transform: rotatey(180deg);

    }

    .track-section {

      .track-arrow-img {
        transform: rotatey(180deg);
      }
    }
  }





}


// @include media-breakpoint-up(xs) {


//   .track-arrow-img {
//     width: 80px;
//     height: 80px;
//     position: absolute;
//     top: 15px;
//     left: 295px;
//   }

//   .input-wrap {
//     width: 100%;
//     height: 57px;


//     .text-input {

//       ::placeholder {
//         font-size: 14px !important;
//         font-weight: 600 !important;
//         color: rgb(var(--v-theme-primary)) !important;

//       }



//     }

//     .arrow-btn {
//       height: 100%;
//       background: url("@/assets/img/icons/arrow-btn.png") center no-repeat;
//       background-size: contain;
//     }

//   }
// }

// @include media-breakpoint-up(md) {
//   .track-arrow-img {
//     width: 80px;
//     height: 80px;
//     position: absolute;
//     top: 10px;
//     left: 350px;
//   }

//   .track-arrow-img {
//     width: 100px;
//     height: 100px;
//     position: absolute;
//     top: 5px;
//     left: 330px;
//   }




// }</style>
