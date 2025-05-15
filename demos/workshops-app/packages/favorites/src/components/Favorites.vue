<template>
    <div>
        <h1>Favorites</h1>
        <hr />
        {{ message }}
    </div>
</template>

<script>
export default {
    name: "Favorites",
    data() {
        return {
            message: "Your favorite workshops will be displayed here.",
        };
    },
};
</script>

<style lang="scss" scoped>
h1 {
    color: olive;
}
</style>