// ------------------------------------------------------------------------
// Bubble Shooter Game Tutorial With HTML5 And JavaScript
// Copyright (c) 2015 Rembound.com
// 
// This program is free software: you can redistribute it and/or modify  
// it under the terms of the GNU General Public License as published by  
// the Free Software Foundation, either version 3 of the License, or  
// (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,  
// but WITHOUT ANY WARRANTY; without even the implied warranty of  
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the  
// GNU General Public License for more details.  
// 
// You should have received a copy of the GNU General Public License  
// along with this program.  If not, see http://www.gnu.org/licenses/.
//
// http://rembound.com/articles/bubble-shooter-game-tutorial-with-html5-and-javascript
// ------------------------------------------------------------------------

// The function gets called when the window is fully loaded
window.onload = function() {
    // Get the canvas and context
    var canvas = document.getElementById("viewport");
    var context = canvas.getContext("2d");
    
    // Timing and frames per second
    var lastframe = 0;
    var fpstime = 0;
    var framecount = 0;
    var fps = 0;
    var times = 0;
	var times2 = 0;
	var times3 = 0;
	var times4 = 0;
    var bubbletype = 0;
	var initialized = false;
    var bubbletimes =0;
	var bubbletimes2 = 0;
	var bubbletimes3 = 0;
	var bubbletimes4 = 0;
	var bubbletimes5 = 0;
	var bubbletimes6 = 0;
	var bubbletimes7 = 0;
	
	
	var x = 0;
	var y = 0;
	var a = 0;
	var b = 0;
	var c = 0;
	var d = 0;
    // Level
    var level = {
        x: 4,           // X position                       
        y: 83,          // Y position
        width: 0,       // Width, gets calculated
        height: 0,      // Height, gets calculated
        columns: 15,    // Number of tile columns
        rows: 14,       // Number of tile rows
        tilewidth: 40,  // Visual width of a tile
        tileheight: 40, // Visual height of a tile
        rowheight: 34,  // Height of a row
        radius: 20,     // Bubble collision radius
        tiles: []       // The two-dimensional tile array
    };

    // Define a tile class  定義class
    var Tile = function(x, y, type, shift) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.removed = false;
        this.shift = shift;
        this.velocity = 0;
        this.alpha = 1;
        this.processed = false;
    };
    
    // Player
    var player = {
        x: 0,
        y: 0,
        angle: 0,
        tiletype: 0,
        bubble: {
                    x: 0,
                    y: 0,
                    angle: 0,
                    speed: 1000,
                    dropspeed: 900,
                    tiletype: 0,
                    visible: false
                },
        nextbubble: {
                        x: 0,
                        y: 0,
                        tiletype: 0
                    }
    };
    
    // Neighbor offset table
    var neighborsoffsets = [[[1, 0], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]], // Even row tiles
                            [[1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]]];  // Odd row tiles
    
    // Number of different colors
    var bubblecolors = 6;
    
    // Game states
    var gamestates = { init: 0, ready: 1, shootbubble: 2, removecluster: 3, triger_click: 4, ShowMeDate: 5,gameover: 6};
    var gamestate = gamestates.init;
    
    // Score
    var score = 0;
    var bd = new Date();
    var bs = bd.getSeconds();
    var bm = bd.getMinutes();
	
    var turncounter = 0;
    var rowoffset = 0;
    
    // Animation variables
    var animationstate = 0;
    var animationtime = 0;
    
    // Clusters
    var showcluster = false;
    var cluster = [];
	var cluster1 = [];
    var floatingclusters = [];
    
    // Images
    var images = [];
    var bubbleimage;
    
    // Image loading global variables
    var loadcount = 0;
    var loadtotal = 0;
    var preloaded = false;
    
    
	
	// Load images
    
	function loadImages(imagefiles) {  //函數加載圖像,imagefiles參數
        // Initialize variables  //初始化變量
        loadcount = 0;  //loadcount(加載數)歸0
        loadtotal = imagefiles.length;  //loadtotal(總數) , 參數長度
        preloaded = false;  //預先載入預設false
        
        // Load the images  //加載圖像
        var loadedimages = [];  //陣列變數下載的圖像
        for (var i=0; i<imagefiles.length; i++) {  //迴圈 , 參數
            // Create the image object  //創建圖像對象
            var image = new Image();  //變數 image 為 呼叫函數
            
            // Add onload event handler  添加onload事件處理程序
            image.onload = function () {  //函數image.onload , 要image內的function Image 開始工作
                loadcount++;  //總數+1
                if (loadcount == loadtotal) {  //loadcount(加載數)和loadtotal(總數)相等
                    // Done loading  加載完成  
                    preloaded = true;     //preloaded更改為true
                }
            };
            
            // Set the source url of the image  設置image網址資源
            image.src = imagefiles[i];  //參數陣列 為 image.src 目標圖片路徑
            
            // Save to the image array  保存到圖像數組
            loadedimages[i] = image;  //參數陣列 為 Image函數
        }
        
        // Return an array of images  返回圖像數組
        return loadedimages;  //Image函數 為 返回數值
    }
    
    // Initialize the game  初始化遊戲
    
	function init() {  //函數init
        // Load images  載入圖片
        images = loadImages(["bubble-sprites.png"]);  //預設圖片載入images
        bubbleimage = images[0];  //bubbleimage為預設圖片陣列0
    
        // Add mouse events  添加鼠標事件 
        canvas.addEventListener("mousemove", onMouseMove);  //addEventListener監聽器 , 指定事件名 , mousemove滑鼠移動的過程來觸發事件
        canvas.addEventListener("mousedown", onMouseDown);  //addEventListener監聽器 , 指定事件名 , onmousedown鼠標按下來觸發事件
        
        // Initialize the two-dimensional tile array  初始化二維瓦片數組
        for (var i=0; i<level.columns; i++) {  //columns 列
            level.tiles[i] = [];  //level.tiles 初始化陣列
            for (var j=0; j<level.rows; j++) {  //rows 行
                // Define a tile type and a shift parameter for animation  為動畫定義圖塊類型和平移參數
                level.tiles[i][j] = new Tile(i, j, 0, 0);  //呼叫建構式Tile 值給 level.tiles[i][j]
            }
        }
        
        level.width = level.columns * level.tilewidth + level.tilewidth/2;  // 0 ,15 , 40
        level.height = (level.rows-1) * level.rowheight + level.tileheight;  // 0 , 14 , 34 , 40
        
        // Init the player  初始化播放器
        player.x = level.x + level.width/2 - level.tilewidth/2;  //球射出x座標
		
        player.y = level.y + level.height;  //球射出y座標
        player.angle = 90;  //角度
        player.tiletype = 0;  //tiletype歸0
        
        player.nextbubble.x = player.x - 2 * level.tilewidth;  // 0 , 上面的 , 40
        player.nextbubble.y = player.y;  // 0 , 上面的
        
        // New game  新遊戲
        newGame();  //呼叫newGame函數
        
        // Enter main loop  進入主循環
        main(0);  //main參數0 , callback
    }
    
    // Main loop
    
	function main(tframe) {  //函數main , 參數tframe
        // Request animation frames  請求動畫幀
        window.requestAnimationFrame(main);    //參數main , callback
    
        if (!initialized) {  //預設 false
            // Preloader  預載器
            
            // Clear the canvas  清除畫布  
            context.clearRect(0, 0, canvas.width, canvas.height);  //(x,y起點 , x,y寬度 ,內皆為空白)
            
            // Draw the frame  畫框
            drawFrame();  //呼叫函數  drawFrame
            
            // Draw a progress bar  繪製進度條
            var loadpercentage = loadcount/loadtotal;  //加載數/總數
            context.strokeStyle = "#ff8080";  //設定勾勒邊框顏色
            context.lineWidth=3;  //設定邊框厚度
            context.strokeRect(18.5, 0.5 + canvas.height - 51, canvas.width-37, 32);  //(x,y起點 , x,y寬度 , 繪製勾勒矩陣)
            context.fillStyle = "#ff8080";  //設定填滿圖形顏色
            context.fillRect(18.5, 0.5 + canvas.height - 51, loadpercentage*(canvas.width-37), 32);  //(x,y起點 , x,y寬度 , 繪製填滿矩陣)
            
            // Draw the progress text  繪製進度文字
            var loadtext = "Loaded " + loadcount + "/" + loadtotal + " images";  //加載數 總數
            context.fillStyle = "#000000";  //設定填滿圖形顏色
            context.font = "16px Verdana";  //設置字體屬性
            context.fillText(loadtext, 18, 0.5 + canvas.height - 63);  //繪製文字使用 font 屬性指定的文字樣式 (將文字繪製到文本中 , (x,y)位置)
            
            if (preloaded) {  //preloaded更改為true時
                // Add a delay for demonstration purposes  出於演示目的添加延遲
                setTimeout(function(){initialized = true;}, 1000);  //延遲1000毫秒執行function
            }
        } else {  //initialized
            // Update and render the game  更新並渲染遊戲
            update(tframe);  //呼叫函數update 參數為main傳入參數
            render();  //呼叫render函數
        }
    }
    
    // Update the game state  更新遊戲狀態
    function update(tframe) {  //函數update 參數tframe
        var dt = (tframe - lastframe) / 1000;  //變數dt 前,後tframe相減 / 1000
        lastframe = tframe;  //當前tframe 改為 成為上一個tframe
        
        // Update the fps counter  更新fps計數器
        updateFps(dt);  //呼叫函數updateFps , 參數為dt
        
        if (gamestate == gamestates.ready) {  //gamestate 為 ready         
            // Game is ready for player input  遊戲可供玩家輸入
        } else if (gamestate == gamestates.shootbubble) {  //  gamestate 為 shootbubble
            // Bubble is moving  氣泡在移動
            stateShootBubble(dt);  //呼叫函數stateShootBubble , 參數為dt
        } else if (gamestate == gamestates.removecluster) {  //gamestate 為 removecluster
            
			// Remove cluster and drop tiles  刪除集群並放置磁貼
            stateRemoveCluster(dt);  //呼叫函數stateRemoveCluster , 參數為dt
			
        }
    }
    
    function setGameState(newgamestate) {  //函數setGameState , 參數為newgamestate
        
		gamestate = newgamestate;  //gamestate更改為當前gamestate
        
        animationstate = 0;  //animationstate歸0
        animationtime = 0;  //animationtime歸0
    }
    
    function stateShootBubble(dt) {  //函數stateShootBubble
        // Bubble is moving  氣泡在移動
        
        // Move the bubble in the direction of the mouse  沿鼠標方向移動氣泡
        player.bubble.x += dt * player.bubble.speed * Math.cos(degToRad(player.bubble.angle));  // 0 , 1000 , 呼叫degToRad函數  ,  射出球的x座標
        player.bubble.y += dt * player.bubble.speed * -1*Math.sin(degToRad(player.bubble.angle));  // 0 , 1000 , 呼叫degToRad函數  ,  射出球的y座標 
        
        // Handle left and right collisions with the level  處理水平方向的左右碰撞
        if (player.bubble.x <= level.x) {  // 射出球的x座標 小於等於4
            // Left edge  左邊緣
            player.bubble.angle = 180 - player.bubble.angle;  //球的角度更改
            player.bubble.x = level.x;  //x座標更改為x最小值
        } else if (player.bubble.x + level.tilewidth >= level.x + level.width) {  //球的x座標 + 40 >= 4 + 上面的
            // Right edge  右邊緣
            player.bubble.angle = 180 - player.bubble.angle;  ////球的角度更改
            player.bubble.x = level.x + level.width - level.tilewidth;  //x座標更改(從右邊為0)
        }
 
        // Collisions with the top of the level  與最高層的碰撞
        if (player.bubble.y <= level.y) {  //超過最上層
            // Top collision  頂撞
            player.bubble.y = level.y;  //y座標更改為y最小值
            snapBubble();  //呼叫函數snapBubble
            return;  //不額外回傳值
        }
        
        // Collisions with other tiles  與其他瓷磚的碰撞
        for (var i=0; i<level.columns; i++) {  //列
            for (var j=0; j<level.rows; j++) {  //行
                var tile = level.tiles[i][j];  //變數tile , 建構式Tile (x, y, type(預設0), shift(預設0))
                
                // Skip empty tiles  跳過空磚
                if (tile.type < 0) {  //若不為空磚為0
                    continue;  //下一個
                }
                
                // Check for intersections  檢查碰撞
                var coord = getTileCoordinate(i, j);  //呼叫函數 etTileCoordinate
                if (circleIntersection(player.bubble.x + level.tilewidth/2,  //呼叫函數circleIntersection
                                       player.bubble.y + level.tileheight/2,
                                       level.radius,  //radius為每顆球半徑碰撞半徑
                                       coord.tilex + level.tilewidth/2,
                                       coord.tiley + level.tileheight/2,
                                       level.radius)) {
                                        
                    // Intersection with a level bubble  帶有水平氣泡的交叉點 
                    snapBubble();  //呼叫snapBubble函數
                    return;  //不額外return
                }
            }
        }
    }
    
    function stateRemoveCluster(dt) {  //函數stateRemoveCluster
        if (animationstate == 0) {  //若animationstate歸0
            resetRemoved();  //呼叫resetRemoved函數
            
            // Mark the tiles as removed  將圖塊標記為已刪除
            for (var i=0; i<cluster.length; i++) {  //需要消除的球團長度
                // Set the removed flag  設置刪除的標誌
                cluster[i].removed = true;  //刪除球團設置為true
				
				
            }
            
            // Add cluster score  添加聚類得分
            score += cluster.length * 100;  //消除球團長度*100為score
            
            // Find floating clusters  查找浮動集群
            floatingclusters = findFloatingClusters();  //呼叫findFloatingClusters()
            
            if (floatingclusters.length > 0) {  //浮空球長度
                // Setup drop animation  設置掉落動態
                for (var i=0; i<floatingclusters.length; i++) {
                    for (var j=0; j<floatingclusters[i].length; j++) {
                        var tile = floatingclusters[i][j];
                        tile.shift = 0;  
                        tile.shift = 1;  //shift更改為1
                        tile.velocity = player.bubble.dropspeed;  //velocity預設為0 球掉下速度預設為900
                        
                        score += 100;  //每個掉下的球+100
                    }
                }
            }
            
            animationstate = 1;  // animationstate 更改為 1
        }
        
        if (animationstate == 1) {  //若 animationstate 更改為1
            // Pop bubbles  拿出泡泡
            var tilesleft = false;  //tilesleft預設false
            for (var i=0; i<cluster.length; i++) {  //消除的球團長度
                var tile = cluster[i];  //需要消除的球團陣列
                
                if (tile.type >= 0) {  //若有球
                    tilesleft = true;  //tilesleft改為true
                    
                    // Alpha animation  阿爾法動畫
                    tile.alpha -= dt * 15;  //預設為1
                    if (tile.alpha < 0) {  //若alpha小於0
                        tile.alpha = 0;    //alpha改為0
                    }
                    
                    if (tile.alpha == 0) {  //若alpha為0
                        tile.type = -1;  //type改為-1
                        tile.alpha = 1;  //alpha改回1 
                    }
                }                
            }
            
            // Drop bubbles  掉泡泡
            for (var i=0; i<floatingclusters.length; i++) {  
                for (var j=0; j<floatingclusters[i].length; j++) {
                    var tile = floatingclusters[i][j];  //浮空球
                    
                    if (tile.type >= 0) {  //若type大於等於0
                        tilesleft = true;  //tilesleft改為true
                        
                        // Accelerate dropped tiles  加速掉落的瓷磚
                        tile.velocity += dt * 700;  //velocity預設為0
                        tile.shift += dt * tile.velocity;  //>>>0
                            
                        // Alpha animation  阿爾法動畫
                        tile.alpha -= dt * 8;  //<<<0
                        if (tile.alpha < 0) {  //若alpha小於0
                            tile.alpha = 0;  //alpha改為0
                        }

                        // Check if the bubbles are past the bottom of the level  //檢查氣泡是否已超過水平線的底部
                        if (tile.alpha == 0 || (tile.y * level.rowheight + tile.shift > (level.rows - 1) * level.rowheight + level.tileheight)) {  
                            tile.type = -1;
                            tile.shift = 0;
                            tile.alpha = 1;
                        }
                    }

                }
            }
            
            if (!tilesleft) {  //若為false
                // Next bubble  //下一個泡泡
                nextBubble();  //呼叫nextBubble函數
                
                // Check for game over  檢查遊戲結束
                var tilefound = false  //tilefound預設false
                for (var i=0; i<level.columns; i++) {  //列
                    for (var j=0; j<level.rows; j++) {  //行
                        if (level.tiles[i][j].type != -1) {  //沒球為-1 , 只要不為-1的
                            tilefound = true;  //tilefound改為true , 找到球
                            break;  //結束
                        }
                    }
                }
                
                if (tilefound) {  //若tilefound改為true
                    setGameState(gamestates.ready);  //setGameState改為ready
                } else {
                    // No tiles left, game over  沒有剩餘的瓷磚，遊戲結束
                    setGameState(gamestates.gameover);  //setGameState改為gameover
                }
            }
        }
    }
    
    // Snap bubble to the grid  將氣泡捕捉到網格
    function snapBubble() {  //函數snapBubble
        // Get the grid position  獲取網格位置
        var centerx = player.bubble.x + level.tilewidth/2;  //球的x座標+40/2
        var centery = player.bubble.y + level.tileheight/2;  //球的y座標+40/2
        var gridpos = getGridPosition(centerx, centery);  //取得網格
		
        // Make sure the grid position is valid  確保網格位置有效
        if (gridpos.x < 0) {  //網格x小於0
            gridpos.x = 0;  //x改為0
        }
            
        if (gridpos.x >= level.columns) {  //若網格x座標>=列
            gridpos.x = level.columns - 1;  //網格x座標
        }

        if (gridpos.y < 0) {  //若網格y座標<0
            gridpos.y = 0;  //網格y座標改為0
        }
            
        if (gridpos.y >= level.rows) {  //若網格y的座標>=行數
            gridpos.y = level.rows - 1;  //網格y座標
        }

        // Check if the tile is empty  檢查瓷磚是否為空
        var addtile = false;  //變數addtile預設false
        if (level.tiles[gridpos.x][gridpos.y].type != -1) {  //若網格的type為-1
            // Tile is not empty, shift the new tile downwards  磁貼不為空，請向下移動新磁貼
            for (var newrow=gridpos.y+1; newrow<level.rows; newrow++) {  //y座標網格  
                if (level.tiles[gridpos.x][newrow].type == -1) {  //若網格位置 type 為 -1
                    gridpos.y = newrow;  //放回網格y座標
                    addtile = true;  //addtile改為true 為 空格
                    break;
                }
            }
        } else {
            addtile = true;  //空格
        }

        // Add the tile to the grid  將圖塊添加到網格
        if (addtile) {  //若網格為空
            // Hide the player bubble  隱藏玩家泡泡
            player.bubble.visible = false;  //預設為false
        
            // Set the tile  設置瓷磚
            level.tiles[gridpos.x][gridpos.y].type = player.bubble.tiletype;  //增加球的type到網格中
            
            // Check for game over  檢查遊戲結束
            if (checkGameOver()) {  //呼叫checkGameOver函數
                return;
            }
            
            // Find clusters  查找集群
            cluster = findCluster(gridpos.x, gridpos.y, true, true, false);  //呼叫findCluster函數 符合條件移除球團陣列
            
			if (cluster.length >= 3){
				for (var i=0; i<cluster.length; i++) {
					if(cluster[i].type==2){
						a=a+1;
					}
					if(cluster[i].type==3){
						b=b+1;
					}
				}
				if(!(a>=2 && b>=1)){
				a=0;
				b=0;
				}
			}
			
			if (cluster.length >= 3){
				for (var i=0; i<cluster.length; i++) {
					if(cluster[i].type==4){
						c=c+1;
					}
					if(cluster[i].type==5){
						d=d+1;
					}
				}
				if(!(c>=2 && d>=1)){
				c=0;
				d=0;
				}
			}
			
			if (cluster.length >= 3){
				for (var i=0; i<cluster.length; i++) {
					if(cluster[i].type==0){
						x=x+1;
					}
					if(cluster[i].type==1){
						y=y+1;
					}
				}
				if(!(x>=2 && y>=1)){
				x=0;
				y=0;
				}
			}
			
            if (cluster.length >= 3 && x>=2 && y>=1) {  //陣列>=3
                // Remove the cluster  刪除集群
				
				
					if(bubbletype==1){
					times=times+1;
					bubbletype=0;
					}
					
					if(bubbletype==2){
					times2=times2+1;
					bubbletype=0;
					}
				
				
					if(bubbletype==3){
					times3=times3+1;
					bubbletype=0;
					}
				
					if(bubbletype==4){
					times4=times4+1;
					bubbletype=0;
					
					}
			
				x=0;
				y=0;
				
				
				
				
				
				setGameState(gamestates.removecluster);//呼叫setGameState , gamestates.removecluster為參數
                return;
				
            }
			
			if (cluster.length >= 3 && a>=2 && b>=1) {  //陣列>=3
                // Remove the cluster  刪除集群
				
				
					if(bubbletype==1){
					times=times+1;
					bubbletype=0;
					}
					
					if(bubbletype==2){
					times2=times2+1;
					bubbletype=0;
					}
				
				
					if(bubbletype==3){
					times3=times3+1;
					bubbletype=0;
					}
				
					if(bubbletype==4){
					times4=times4+1;
					bubbletype=0;
					
					}
			
				a=0;
				b=0;
				
				
				
				
				
				setGameState(gamestates.removecluster);//呼叫setGameState , gamestates.removecluster為參數
                return;
				
            }
			
			if (cluster.length >= 3 && c>=2 && d>=1) {  //陣列>=3
                // Remove the cluster  刪除集群
				
				
					if(bubbletype==1){
					times=times+1;
					bubbletype=0;
					}
					
					if(bubbletype==2){
					times2=times2+1;
					bubbletype=0;
					}
				
				
					if(bubbletype==3){
					times3=times3+1;
					bubbletype=0;
					}
				
					if(bubbletype==4){
					times4=times4+1;
					bubbletype=0;
					
					}
			
				c=0;
				d=0;
				
				
				
				
				
				setGameState(gamestates.removecluster);//呼叫setGameState , gamestates.removecluster為參數
                return;
				
            }
			
        }
        
        // No clusters found  找不到集群
        turncounter++;  //turncounter+1
        if (turncounter >= 5) {  //沒消除次數>=5
            // Add a row of bubbles  添加一行氣泡
            addBubbles();  //呼叫addBubbles函數
            turncounter = 0;  //turncounter(計數)歸0
            rowoffset = (rowoffset + 1) % 2;  //奇數偶數行
            
            if (checkGameOver()) {  //checkGameOver() , 結果若為1
                return;
            }
        }

        // Next bubble  下一個泡泡
        nextBubble();  //nextBubble函數
        setGameState(gamestates.ready);  //setGameState函數 , 參數gamestates.ready
    }
    
    function checkGameOver() {  //呼叫checkGameOver函數
        // Check for game over  檢查遊戲結束
        for (var i=0; i<level.columns; i++) {  //每列
            // Check if there are bubbles in the bottom row  檢查底行是否有氣泡
            if (level.tiles[i][level.rows-1].type != -1) {  //每個type為-1(無球)
                // Game over  //遊戲結束
                nextBubble();  //呼叫nextBubble函數
                setGameState(gamestates.gameover);  //gamestates設為gameover
                return true;  //return true
            }
        }
        
        return false;  //return false
    }
    
    function addBubbles() {  //addBubbles函數
        // Move the rows downwards  向下移動行
        for (var i=0; i<level.columns; i++) {  //列
            for (var j=0; j<level.rows-1; j++) {  //行-1
                level.tiles[i][level.rows-1-j].type = level.tiles[i][level.rows-1-j-1].type;  //奇數偶數行調整
            }
        }
        
        // Add a new row of bubbles at the top  在頂部添加新的一行氣泡
        for (var i=0; i<level.columns; i++) {  //直的(每個添加)
            // Add random, existing, colors  添加隨機的現有顏色
            level.tiles[i][0].type = getExistingColor();  //呼叫getExistingColor函數
        }
    }
    
    // Find the remaining colors  找到剩餘的顏色
    function findColors() {  //findColors函數  找到還有的
        var foundcolors = [];  //foundcolors空陣列
        var colortable = [];  //colortable空陣列
        for (var i=0; i<bubblecolors; i++) {  //顏色種類
            colortable.push(false);  //colortable 預設 false
        }
        
        // Check all tiles  檢查所有瓷磚
        for (var i=0; i<level.columns; i++) {  //直的
            for (var j=0; j<level.rows; j++) {  //橫的
                var tile = level.tiles[i][j];  //每個瓷磚
                if (tile.type >= 0) {  //有球的
                    if (!colortable[tile.type]) {  //若沒顏色
                        colortable[tile.type] = true;  //colortable改為true
                        foundcolors.push(tile.type);  //把剩下的有顏色的放進foundcolors
                    }
                }
            }
        }
        
        return foundcolors;
    }
    
    // Find cluster at the specified tile location  在指定的圖塊位置查找集群
    function findCluster(tx, ty, matchtype, reset, skipremoved) {  //findCluster函數
        // Reset the processed flags  重置已處理的標誌
        if (reset) {  //若為true
            resetProcessed();  //重置
        }
        
        // Get the target tile. Tile coord must be valid.  獲取目標圖塊。平鋪坐標必須有效。
        var targettile = level.tiles[tx][ty];  
        
        // Initialize the toprocess array with the specified tile  用指定的tile初始化toprocess數組
        var toprocess = [targettile];
        targettile.processed = true;
        var foundcluster = [];
		
        while (toprocess.length > 0) {
            // Pop the last element from the array  從數組中彈出最後一個元素
            var currenttile = toprocess.pop();
            
            // Skip processed and empty tiles  跳過處理過的空瓷磚
            if (currenttile.type == -1) {
                continue;
            }
            
            // Skip tiles with the removed flag  跳過帶有已刪除標誌的圖塊
            if (skipremoved && currenttile.removed) {
                continue;
            }
            
            // Check if current tile has the right type, if matchtype is true  檢查當前圖塊是否具有正確的類型，如果matchtype為true
            if (!matchtype || ((currenttile.type == 0 && targettile.type == 0) || (currenttile.type == 0 && targettile.type == 1) || (currenttile.type == 1 && targettile.type == 0) || (currenttile.type == 1 && targettile.type == 1))) {
				
                // Add current tile to the cluster  將當前磁貼添加到群集
                bubbletype=1;
				foundcluster.push(currenttile);
				
               
				
                // Get the neighbors of the current tile  獲取當前圖塊的鄰居
                var neighbors = getNeighbors(currenttile);
                
                // Check the type of each neighbor  檢查每個鄰居的類型
                for (var i=0; i<neighbors.length; i++) {
                    if (!neighbors[i].processed) {
                        // Add the neighbor to the toprocess array  將鄰居添加到toprocess數組
                        toprocess.push(neighbors[i]);
                        neighbors[i].processed = true;
                    }
                }
				
            }
			if (!matchtype || ((currenttile.type == 2 && targettile.type == 2) || (currenttile.type == 2 && targettile.type == 3) || (currenttile.type == 3 && targettile.type == 2) || (currenttile.type == 3 && targettile.type == 3))) {
				
                // Add current tile to the cluster  將當前磁貼添加到群集
                bubbletype=2;
				foundcluster.push(currenttile);
				
                
                // Get the neighbors of the current tile  獲取當前圖塊的鄰居
                var neighbors = getNeighbors(currenttile);
                
                // Check the type of each neighbor  檢查每個鄰居的類型
                for (var i=0; i<neighbors.length; i++) {
                    if (!neighbors[i].processed) {
                        // Add the neighbor to the toprocess array  將鄰居添加到toprocess數組
                        toprocess.push(neighbors[i]);
                        neighbors[i].processed = true;
                    }
                }
				
            }
			
			if (!matchtype || ((currenttile.type == 4 && targettile.type == 4) || (currenttile.type == 4 && targettile.type == 5) || (currenttile.type == 5 && targettile.type == 4) || (currenttile.type == 5 && targettile.type == 5))) {
				
                // Add current tile to the cluster  將當前磁貼添加到群集
                bubbletype=3;
				foundcluster.push(currenttile);
                
                // Get the neighbors of the current tile  獲取當前圖塊的鄰居
                var neighbors = getNeighbors(currenttile);
                
                // Check the type of each neighbor  檢查每個鄰居的類型
                for (var i=0; i<neighbors.length; i++) {
                    if (!neighbors[i].processed) {
                        // Add the neighbor to the toprocess array  將鄰居添加到toprocess數組
                        toprocess.push(neighbors[i]);
                        neighbors[i].processed = true;
                    }
                }
				
            }
			if (!matchtype || ((currenttile.type == 6 && targettile.type == 6) || (currenttile.type == 6 && targettile.type == 6) || (currenttile.type == 6 && targettile.type == 6) || (currenttile.type == 6 && targettile.type == 6))) {
				
                // Add current tile to the cluster  將當前磁貼添加到群集
                bubbletype=4;
				
				foundcluster.push(currenttile);
                
                // Get the neighbors of the current tile  獲取當前圖塊的鄰居
                var neighbors = getNeighbors(currenttile);
                
                // Check the type of each neighbor  檢查每個鄰居的類型
                for (var i=0; i<neighbors.length; i++) {
                    if (!neighbors[i].processed) {
                        // Add the neighbor to the toprocess array  將鄰居添加到toprocess數組
                        toprocess.push(neighbors[i]);
                        neighbors[i].processed = true;
                    }
                }
				
            }
			
        }
		
		
		
        // Return the found cluster
        return foundcluster;
    }
    
    // Find floating clusters
    function findFloatingClusters() {
        // Reset the processed flags
        resetProcessed();
        
        var foundclusters = [];
        
        // Check all tiles
        for (var i=0; i<level.columns; i++) {
            for (var j=0; j<level.rows; j++) {
                var tile = level.tiles[i][j];
                if (!tile.processed) {
                    // Find all attached tiles
                    var foundcluster = findCluster(i, j, false, false, true);
                    
                    // There must be a tile in the cluster
                    if (foundcluster.length <= 0) {
                        continue;
                    }
                    
                    // Check if the cluster is floating
                    var floating = true;
                    for (var k=0; k<foundcluster.length; k++) {
                        if (foundcluster[k].y == 0) {
                            // Tile is attached to the roof
                            floating = false;
                            break;
                        }
                    }
                    
                    if (floating) {
                        // Found a floating cluster
                        foundclusters.push(foundcluster);
                    }
                }
            }
        }
        
        return foundclusters;
    }
    
    // Reset the processed flags  重置已處理的標誌
    function resetProcessed() {
        for (var i=0; i<level.columns; i++) {  //直的
            for (var j=0; j<level.rows; j++) {  //橫的
                level.tiles[i][j].processed = false;  //預設為true
            }
        }
    }
    
    // Reset the removed flags
    function resetRemoved() {
        for (var i=0; i<level.columns; i++) {
            for (var j=0; j<level.rows; j++) {
                level.tiles[i][j].removed = false;
            }
        }
    }
    
    // Get the neighbors of the specified tile  獲取指定圖塊的鄰居
    function getNeighbors(tile) {
        var tilerow = (tile.y + rowoffset) % 2; // Even or odd row
        var neighbors = [];
        
        // Get the neighbor offsets for the specified tile  獲取指定圖塊的鄰居偏移量
        var n = neighborsoffsets[tilerow];
        
        // Get the neighbors  得到鄰居
        for (var i=0; i<n.length; i++) {
            // Neighbor coordinate
            var nx = tile.x + n[i][0];
            var ny = tile.y + n[i][1];
            
            // Make sure the tile is valid  確保圖塊有效
            if (nx >= 0 && nx < level.columns && ny >= 0 && ny < level.rows) {
                neighbors.push(level.tiles[nx][ny]);
            }
        }
        
        return neighbors;
    }
    
    function updateFps(dt) {
        if (fpstime > 0.25) {
            // Calculate fps
            fps = Math.round(framecount / fpstime);  //
            
            // Reset time and framecount
            fpstime = 0;
            framecount = 0;
        }
        
        // Increase time and framecount
        fpstime += dt;
        framecount++;
    }
    
    // Draw text that is centered
    function drawCenterText(text, x, y, width) {
        var textdim = context.measureText(text);
        context.fillText(text, x + (width-textdim.width)/2, y);
    }
    
    // Render the game
    function render() {
        // Draw the frame around the game
        drawFrame();
        
        var yoffset =  level.tileheight/2;
        
        // Draw level background
        context.fillStyle = "#8c8c8c";
        context.fillRect(level.x - 4, level.y - 4, level.width + 8, level.height + 4 - yoffset);
        
        // Render tiles
        renderTiles();
        
        // Draw level bottom
        context.fillStyle = "#656565";
        context.fillRect(level.x - 4, level.y - 4 + level.height + 4 - yoffset, level.width + 8, 2*level.tileheight + 3);
        
        // Draw score
        context.fillStyle = "#ffffff";
        context.font = "18px Verdana";
        var scorex = level.x + level.width - 150;
        var scorey = level.y+level.height + level.tileheight - yoffset - 8;
        drawCenterText("Score:", scorex, scorey, 150);
        context.font = "24px Verdana";
        drawCenterText(score, scorex, scorey+30, 150);

        // Render cluster
        if (showcluster) {
            renderCluster(cluster, 255, 128, 128);
            
            for (var i=0; i<floatingclusters.length; i++) {
                var col = Math.floor(100 + 100 * i / floatingclusters.length);
                renderCluster(floatingclusters[i], col, col, col);
            }
        }
        
        
        // Render player bubble
        renderPlayer();
        
        // Game Over overlay
        if (gamestate == gamestates.gameover) {
            context.fillStyle = "rgba(0, 0, 0, 0.8)";
            context.fillRect(level.x - 4, level.y - 4, level.width + 8, level.height + 2 * level.tileheight + 8 - yoffset);
            
            context.fillStyle = "#ffffff";
            context.font = "24px Verdana";
            drawCenterText("遊戲結束!", level.x, level.y + level.height / 2 + 10, level.width);
            drawCenterText("點擊進行下一步!", level.x, level.y + level.height / 2 + 40, level.width);
        }
    }
    
    // Draw a frame around the game
    function drawFrame() {
        // Draw background
        context.fillStyle = "#e8eaec";
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw header
        context.fillStyle = "#303030";
        context.fillRect(0, 0, canvas.width, 79);
        
        // Draw title
        context.fillStyle = "#ffffff";
        context.font = "24px Verdana";
        context.fillText("Bubble Shooter", 220, 37);
        
        // Display fps
        context.fillStyle = "#ffffff";
        context.font = "12px Verdana";
        context.fillText("Fps: " + fps, 13, 57);
		
		context.fillStyle = "#AAAAAA";
        context.font = "12px Verdana";
        context.fillText("FeS: " + times, 120, 57);
		context.fillText("KOH: " + times2, 240, 57);
		context.fillText("AgBr: " + times3, 360, 57);
		
		
    }
    
    // Render tiles
    function renderTiles() {
        // Top to bottom
        for (var j=0; j<level.rows; j++) {
            for (var i=0; i<level.columns; i++) {
                // Get the tile
                var tile = level.tiles[i][j];
            
                // Get the shift of the tile for animation
                var shift = tile.shift;
                
                // Calculate the tile coordinates
                var coord = getTileCoordinate(i, j);
                
                // Check if there is a tile present
                if (tile.type >= 0) {
                    // Support transparency
                    context.save();
                    context.globalAlpha = tile.alpha;
                    
                    // Draw the tile using the color
                    drawBubble(coord.tilex, coord.tiley + shift, tile.type);
                    
                    context.restore();
                }
            }
        }
    }
    
    // Render cluster  渲染集群
    function renderCluster(cluster, r, g, b) {
        for (var i=0; i<cluster.length; i++) {
            // Calculate the tile coordinates  計算瓷磚坐標
            var coord = getTileCoordinate(cluster[i].x, cluster[i].y);  //消除團的(x,y)
            
            // Draw the tile using the color  使用顏色繪製瓷磚
            context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";  //設定填滿的顏色
            context.fillRect(coord.tilex+level.tilewidth/4, coord.tiley+level.tileheight/4, level.tilewidth/2, level.tileheight/2);  //(x,y起點 , x,y寬度 , 繪製填滿矩陣)
        }
    }
    
    // Render the player bubble  渲染玩家泡泡
    function renderPlayer() {
        var centerx = player.x + level.tilewidth/2;
        var centery = player.y + level.tileheight/2;
        
        // Draw player background circle
        context.fillStyle = "#7a7a7a";  //設定填滿的顏色
        context.beginPath();  //產生一個新路徑，產生後再使用繪圖指令來設定路徑
        context.arc(centerx, centery, level.radius+12, 0, 2*Math.PI, false);  //圓中心x座標,圓中心y座標,圓半徑,起始角,結束角,順時針
        context.fill();  //填充路徑
        context.lineWidth = 2;  //邊框長度
        context.strokeStyle = "#8c8c8c";  //設定勾勒圖形時用的顏色
        context.stroke();  //繪圖

        // Draw the angle
        context.lineWidth = 2;  //邊框長度
        context.strokeStyle = "#0000ff";  //設定勾勒圖形時用的顏色
        context.beginPath();  //產生一個新路徑，產生後再使用繪圖指令來設定路徑
        context.moveTo(centerx, centery);  //繪製起始點
        context.lineTo(centerx + 1.5*level.tilewidth * Math.cos(degToRad(player.angle)), centery - 1.5*level.tileheight * Math.sin(degToRad(player.angle)));  //繪製到達的點
        context.stroke();  //繪圖
        
        // Draw the next bubble
        drawBubble(player.nextbubble.x, player.nextbubble.y, player.nextbubble.tiletype);
        
        // Draw the bubble
        if (player.bubble.visible) {
            drawBubble(player.bubble.x, player.bubble.y, player.bubble.tiletype);
        }
        
    }
    
    // Get the tile coordinate  獲取平鋪坐標
    function getTileCoordinate(column, row) {
        var tilex = level.x + column * level.tilewidth;
        
        // X offset for odd or even rows  X偏移為奇數或偶數行
        if ((row + rowoffset) % 2) {
            tilex += level.tilewidth/2;
        }
        
        var tiley = level.y + row * level.rowheight;
        return { tilex: tilex, tiley: tiley };
    }
    
    // Get the closest grid position  獲取最接近的網格位置
    function getGridPosition(x, y) {
        var gridy = Math.floor((y - level.y) / level.rowheight);  //回傳<=最大整數
        
        // Check for offset  檢查偏移量
        var xoffset = 0;
        if ((gridy + rowoffset) % 2) {
            xoffset = level.tilewidth / 2;
        }
        var gridx = Math.floor(((x - xoffset) - level.x) / level.tilewidth);  //回傳<=最大整數
        
        return { x: gridx, y: gridy };
    }

    
    // Draw the bubble  畫泡泡
    function drawBubble(x, y, index) {  //下一個球的時候畫
        if (index < 0 || index >= bubblecolors)
            return;
        
        // Draw the bubble sprite  繪製氣泡精靈
        context.drawImage(bubbleimage, index * 40, 0, 40, 40, x, y, level.tilewidth, level.tileheight);  
    }
    
    // Start a new game  開始新遊戲
    function newGame() {
        // Reset score  重設分數
        score = 0;
        
        turncounter = 0;
        rowoffset = 0;
        
        // Set the gamestate to ready  將游戲狀態設置為就緒
        setGameState(gamestates.ready);
        
        // Create the level  創建關卡
        createLevel();

        // Init the next bubble and set the current bubble  初始化下一個氣泡並設置當前氣泡
        nextBubble();
        nextBubble();
    }
    
    // Create a random level  創建一個隨機關卡
    function createLevel() {
        // Create a level with random tiles
        for (var j=0; j<level.rows; j++) {
            var randomtile = randRange(0, bubblecolors-1);
            var count = 0;
            for (var i=0; i<level.columns; i++) {
                if (count >= 1) {  //超過某個數字以上換顏色
                    // Change the random tile
                    var newtile = randRange(0, bubblecolors-1);
                    
                    // Make sure the new tile is different from the previous tile
                    if (newtile == randomtile) {
                        newtile = (newtile + 1) % bubblecolors;
                    }
                    randomtile = newtile;
                    count = 0;
                }
                count++;
                
                if (j < level.rows/2) {
                    level.tiles[i][j].type = randomtile;
                } else {
                    level.tiles[i][j].type = -1;
                }
            }
        }
    }
    
    // Create a random bubble for the player  為玩家創建一個隨機氣泡
    function nextBubble() {
        // Set the current bubble
        player.tiletype = player.nextbubble.tiletype;
        player.bubble.tiletype = player.nextbubble.tiletype;
        player.bubble.x = player.x;
        player.bubble.y = player.y;
        player.bubble.visible = true;
        
        // Get a random type from the existing colors
        var nextcolor = getExistingColor();
        
        // Set the next bubble
        player.nextbubble.tiletype = nextcolor;
    }
    
    // Get a random existing color
    function getExistingColor() {
        existingcolors = findColors();
        
        var bubbletype = 0;
        if (existingcolors.length > 0) {
            bubbletype = existingcolors[randRange(0, existingcolors.length-1)];
        }
        
        return bubbletype;
    }
    
    // Get a random int between low and high, inclusive
    function randRange(low, high) {
        return Math.floor(low + Math.random()*(high-low+1));
    }
    
    // Shoot the bubble
    function shootBubble() {
        // Shoot the bubble in the direction of the mouse
        player.bubble.x = player.x;
        player.bubble.y = player.y;
        player.bubble.angle = player.angle;
        player.bubble.tiletype = player.tiletype;

        // Set the gamestate
        setGameState(gamestates.shootbubble);
    }
    
    // Check if two circles intersect
    function circleIntersection(x1, y1, r1, x2, y2, r2) {
        // Calculate the distance between the centers
        var dx = x1 - x2;
        var dy = y1 - y2;
        var len = Math.sqrt(dx * dx + dy * dy);
        
        if (len < r1 + r2) {
            // Circles intersect
            return true;
        }
        
        return false;
    }
    
    // Convert radians to degrees
    function radToDeg(angle) {
        return angle * (180 / Math.PI);
    }
    
    // Convert degrees to radians
    function degToRad(angle) {
        return angle * (Math.PI / 180);
    }

    // On mouse movement
    function onMouseMove(e) {
        // Get the mouse position
        var pos = getMousePos(canvas, e);

        // Get the mouse angle
        var mouseangle = radToDeg(Math.atan2((player.y+level.tileheight/2) - pos.y, pos.x - (player.x+level.tilewidth/2)));

        // Convert range to 0, 360 degrees
        if (mouseangle < 0) {
            mouseangle = 180 + (180 + mouseangle);
        }

        // Restrict angle to 8, 172 degrees
        var lbound = 8;
        var ubound = 172;
        if (mouseangle > 90 && mouseangle < 270) {
            // Left
            if (mouseangle > ubound) {
                mouseangle = ubound;
            }
        } else {
            // Right
            if (mouseangle < lbound || mouseangle >= 270) {
                mouseangle = lbound;
            }
        }

        // Set the player angle
        player.angle = mouseangle;
    }

    // Get the mouse position
    function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
            y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
        };
    }

    // Call init to start the game
    init();

    function Check_Time() {
        var SetMinute = 0;
        SetMinute += 1;
        var Cal_Hour = Math.floor(SetMinute / 3600);
        var Cal_Minute = Math.floor(Math.floor(SetMinute % 3600) / 60);
        var Cal_Second = SetMinute;

        //var playTime=Cal_Second+Cal_Minute*60+Cal_Hour*3600;



    }
    function newpage(){
        location.href="http://120.110.115.168/index/Bubble-Shooter-HTML5-master/bubble-shooter.html";
    }
    function express()
    {
        //alert("ok");
        //console.log("studentId");
        //var id=randRange(1000,9999);

        /*var studentIdElement = document.getElementById("studentId");
        var studentId = studentIdElement.value;
        var pinElement = document.getElementById("pin");
        var pin = pinElement.value;*/
        //var studentId = Number(document.getElementById("studentId").text);
        //var pin = Number(document.getElementById("pin").text);



        var ed = new Date();
        var es = ed.getSeconds();
        var em = ed.getMinutes();
        var playTime=(es+em*60)-(bs+bm*60);

        //data:  "&id="+id+"&studentId="+studentId+"&pin="+pin+"&score="+score+"&playTime="+playTime,
        /////////////1
        //let url = 'getscore.php';

        $.ajax({
            url: 'getscore.php',
            type: 'POST',
            dataType: 'text',
            data:  "&score="+score+"&playTime="+playTime,
            success:function(){
                undo();
            }

        })

        newGame();
    }
    function undo(){

    }
    // On mouse button click
    function onMouseDown(e) {
        // Get the mouse position
        var pos = getMousePos(canvas, e);
        
        if (gamestate == gamestates.ready) {
            shootBubble();
        } else if (gamestate == gamestates.gameover) {
            express();
            $('#exampleModal').modal('show');
        }
    }




};