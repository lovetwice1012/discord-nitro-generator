const request = require("request");
const fs = require("fs");
const figlet = require("figlet");
const colors = require("colors");
const proxies = __dirname + "/proxies.txt";
var term = require("terminal-kit").terminal;
var proxyLine = 0;
var proxyUrl = "";
var working = [];

const triesPerSecond = 1;

console.clear();
console.log(figlet.textSync("Nitro Gen").green);
console.log(figlet.textSync("v4.2.0.6.9").blue);
console.log(figlet.textSync("By: Tear").red);


generatecode = function() {
  let code = "";
  let dict = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (var i = 0; i < 16; i++) {
    code = code + dict.charAt(Math.floor(Math.random() * dict.length));
  }
  return code;
};

function updateLine(){
    proxyLine++;
    var lineReader = require('line-reader');
    var readLine = 0;
    lineReader.eachLine(proxies, function(line, last) {
        readLine++;
        if (readLine === proxyLine) {
            proxyUrl = "http://" + line;
        }
        if (last) {
            readLine = 0;
        }
    });
}

updateLine();

checkCode =  function (code) {
   var proxiedRequest = request.defaults({'proxy': proxyUrl});
    proxiedRequest.timeout = 1500;
    proxiedRequest.get(`https://discordapp.com/api/v6/entitlements/gift-codes/${code}?with_application=false&with_subscription_plan=true`,  (error, resp, body)  => {
        if(error){
            term.brightYellow("Invalid proxy switching now...\n");
            updateLine();
            return;
        }
        try {
            body = JSON.parse(body);
            if(body.message != "Unknown Gift Code" && body.message != "You are being rate limited."){
                term.brightGreen(`This code should work unless an error is posted below! https://discord.gift/${code}\n`);
                console.log(JSON.stringify(body, null, 4));
                working.push(`https://discord.gift/${code}`);
                fs.writeFileSync(__dirname + '/codes.json', JSON.stringify(working, null, 4));
            }
            else if(body.message === "You are being rate limited.\n") {
                updateLine();
                term.brightRed("Your being rate limited! switching...\n");

            }else{
                term.brightBlue(`discord.com/gifts/${code} is an invalid code!\n`);
            }
        }
        catch (error) {
          term.gray("An error occurred:\n");
          term.gray(error+"\n");
            return;
        }
    });
}



function question() {
  term.brightYellow(
    `Would you like to run Tear#1261's nitro generator? [Y|N]\n`
  );

  term.yesOrNo({ yes: ["y", "ENTER"], no: ["n"] }, function(error, result) {
    if (result) {
        var progressBar , progress = 0 ;


        function doProgress()
        {
            // Add random progress
            progress += Math.random() / 10 ;
            progressBar.update( progress ) ;
            
            if ( progress >= 1 )
            {

                console.clear();
                setTimeout(function() {
                    term.brightCyan("Made by: Tear#1261\n");
                  }, 2000);
                  setTimeout(function() {
                    term.brightCyan(
                      "If you payed for this generator you got scammed lmao\n"
                    );
                  }, 4000);
                  setTimeout(function() {
                    term.brightCyan(
                      "Normally takes about 15 minutes to find a working code\n"
                    );
                  }, 6000);
                  setTimeout(function() {
                    term.brightCyan("Press 'N' to stop the generator at any time\n");
                  }, 8000);
                  setTimeout(function() {
                    term.brightCyan("Enjoy :)\n");
                  }, 10000);
          
                  term.green(`-------------------------------------\n`);
                  term.green(`Discord nitro giftcard generater v4.2.0.6.9\n`);
                  term.green(`Checking a code every ${1 / triesPerSecond} second(s)\n`);
          
                  setTimeout(function() {
                    checkCode(generatecode());
                    setInterval(() => {
                      checkCode(generatecode());
                    }, (1 / triesPerSecond) * 250);
                  }, 12000);
                
            }
            else
            {
                setTimeout( doProgress , 100 + Math.random() * 400 ) ;
            }
        }
        
        
        progressBar = term.progressBar( {
            width: 80 ,
            title: 'Starting generator....' ,
            eta: true ,
            percent: true
        } ) ;
        
        doProgress() ;

        

    
      

      
    } else {
      term.red("'No' detected, now quitting generator...\n");
      process.exit();
    }
  });
}

question();

// made by tear
// https://github.com/therealtear
