# 巴哈姆特電玩通 題庫蒐集與答題輔助腳本

# 前言
主要是蒐集動漫電玩通的題目，因為想要知道但卻沒有地方可以找。  
之前原本是想作手動輸入的 Google 表單，但覺得太麻煩，而且使用者提供的資料不一定正確，因此就做了這個。  
是一個從年初就一直到現在的腳本，中間其實差不多完成了，但有一些小任務還沒做完，因此拖到最近做好了才發布，這個腳本也讓我學習了很多。  
已經蒐集到的題庫可以查看以下網址：[https://goo.gl/k8e7vr](https://goo.gl/k8e7vr)  

# 如何安裝？
前置需求：**建議**安裝 Tampermonkey ([Chrome](https://chrome.google.com/webstore/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo)) ([Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey)) ([Safari](https://safari.tampermonkey.net/tampermonkey.safariextz)) ([Edge](https://www.microsoft.com/store/apps/9NBLGGH5162S))
下載頁面：[https://goo.gl/jJ6VEH](https://goo.gl/jJ6VEH)

有安裝好擴充功能後，點進下載頁面，然後點選　`安裝腳本`，然後按確定即可。  
相關設定請繼續往下看。  

# 關於這個腳本
巴哈姆特動漫電玩通題庫系統，主要功能為蒐集題目。  
腳本沒有什麼需要進到 code 部分設定的，一切都在Ｃ頁的頁面做設定。  

進到頁面中，滑到最下方應該就可以右下方看見多出來的一個區塊。  
![介面](https://imgur.com/x3ZEz65.png) 

**注意**：當答案正在回傳時，動漫電玩通的背景顏色會變成灰色的，這時候要麻煩請勿重新整理網頁，回傳的時間只要幾秒就可以完成了。（重新整理也不會怎麼樣，只是會回傳失敗；如果灰色很久，代表可能出現了未知的錯誤，如果可以的話請按下 F12 然後截圖並回傳，感謝。）  
![答案回傳中](https://imgur.com/HKwakv6.png)  

## 查看題庫
點 **查看題庫** 的連結就可以連到 Google 表單，這個腳本的資料庫是基於 Google 表單的。  

## 自動作答並回報
**自動作答並回報** 的切換按鈕，按一下就可以切換；這個功能在瀏覽Ｂ頁的時候，就可以自動作答，但是如果題庫中已經有答案就不會作答。  
而 **獲得提示**，當題庫中有答案的時候，點下去就會獲得提示。  
![獲取提示](https://imgur.com/5oBR4G0.png)  

## 顯示原題目與答案
功能如其名這樣吧XD 當作答完題目也會自動顯示。  
![顯示原題目與答案](https://imgur.com/cztmsgR.png)  

# 腳本作用說明
腳本作用的主要效果就是紀錄答了什麼，正確與否，並回傳到 Google 資料庫。  
如果發現任何問題或是要建議任何事項，請至本串回文，或是至作者小屋，又或是站內信回應。  

# 已知錯誤
目前暫無  

# 版本更新紀錄
見 [CHANGELOG](https://github.com/moontai0724/bahamut-quiz-script/blob/master/CHANGELOG.md)  
