# HyRead圖書註記匯出Google Chrome擴充程式

## 介紹短片
- https://www.youtube.com/watch?v=sHfjKT57T1I

## How to Build the Extension
```shell
# install packages
npm run setup

# build extension
npm run build

# clean
npm run clean

# package the chrome extension
npm run package
```

## TODO
- [X] Rewrite this to typescript
- [X] Add unit testing
- [X] Add exporting function for online viewing
- [ ] Add Readwise reader API integration
- [ ] OAuth integration: https://developers.dropbox.com/oauth-guide
- [ ] Integrate cloud storage
  - [ ] Google Drive
  - [ ] Dropbox
- [ ] Add a config for how to group the annotation
  - [ ] Sort by update time
- [ ] Customize exporting format
- [ ] Integrate with other services
  - [ ] Zapier
    - [ ] Save to google drive
    - [ ] Save to ...
  - [ ] Notion
  - [ ] ...
- [ ] Sync all books at once
