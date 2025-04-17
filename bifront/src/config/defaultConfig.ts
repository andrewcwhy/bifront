import { BifrontConfig } from '../types/config'

export const defaultConfig: BifrontConfig = {
    port: 9705,
    sidebar: {
        initalState: 'expanded',
        sort: 'asc',
    },
    fileExplorer: {
        showHiddenFiles: false,
        excludePatterns: ['node_modules', '.git', 'dist', 'build'],
    },
}
