# HyRead圖書註記匯出Google Chrome擴充程式

## 介紹短片
- https://www.youtube.com/watch?v=sHfjKT57T1I

## How to Build the Extension
```shell
# install packages
make setup
# build the content-script bundle
make build
# package the chrome extension
make package
```

## TODO
- [X] Rewrite this to typescript
- [ ] Add exporting function for online viewing
- [ ] Customize exporting format
- [ ] Integrate with other services
  - [ ] Zapier
    - [ ] Save to google drive
    - [ ] Save to ...
  - [ ] Notion
  - [ ] ...
- [ ] Sync all books at once
