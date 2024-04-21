<script setup lang="ts">
import String from '@/components/String.vue';
import Button from '@/components/Button.vue';
import { Language, Languages } from '@/lib/language';
import { useConfiguration } from '@/stores/configuration';
import { Theme, Themes } from '@/lib/theme';

const configuration = useConfiguration();


function setLanguage(lang: Language) {
    configuration.language = lang;
}

function setTheme(theme: Theme) {
    configuration.theme = theme;
}

</script>

<template>
    <div class="SettingsView">
        <span class="title"><String name="settings_title"/>&nbsp;&nbsp;<i class="fa-solid fa-gear"></i></span>
        <div class="split">
            <div class="left">
                <div>
                    <span><String name="settings_language_label"/>&nbsp;&nbsp;<i class="fa-solid fa-language"></i></span>
                </div>
                <div>
                    <span><String name="settings_theme_label"/>&nbsp;&nbsp;<i class="fa-solid fa-circle-half-stroke"></i></span>
                </div>
            </div>
            <div class="right">
                <div>
                    <div class="setting">
                        <Button v-for="lang in Languages" 
                            @click="setLanguage(lang)"
                            :active="configuration.language == lang">
                            <String name="lang_name" :language="lang"></String>
                        </Button>
                    </div>
                </div>
                <div>
                    <div class="setting">
                        <Button v-for="theme in Themes"
                            @click="setTheme(theme)"
                            :active="configuration.theme == theme">
                            <String :name="`theme_${theme}_name`"></String>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '@/styles/lib/dimens';
.SettingsView {
    $padding: dimens.$padding; 

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: $padding;

    > .title {
        font-weight: 700;
        font-size: 1.4em;
    }

    > .split {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: center;
        
        > div {
            display: flex;
            flex-direction: column;
            gap: $padding;

            > div {
                display: flex;
                flex-direction: column;
                justify-content: center;
                height: 2em;
            }
        }

        $split_gap: calc($padding * 2);

        > .left {
            min-width: 45%;
            align-items: end;
            padding-right: calc($split_gap / 2);
            color: rgba(var(--clr-fg), 0.5);
        }

        > .right {
            width: 100%;
            align-items: start;
            padding-left: calc($split_gap / 2);
        }
    }

    .setting {
        display: flex;
        flex-direction: row;
        gap: $padding;
    }

}
</style>