import { defineConfig } from 'bifront'

export default defineConfig({
    confirmBeforeDelete: false,
    port: 9705,
    excludeExtensions: ['.js', '.jsx', '.ts', '.tsx'],
    autoOpen: true,

})