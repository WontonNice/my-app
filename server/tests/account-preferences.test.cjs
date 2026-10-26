const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json')});
const {accountDay,previousAccountDay,loginStreak,ACCOUNT_COLORS,accountColor}=require('../src/shared/accountPreferences.ts');
test('daily boundaries follow New York, including daylight saving and year rollover',()=>{
 assert.equal(accountDay(new Date('2026-10-26T03:59:59Z')),'2026-10-25');
 assert.equal(accountDay(new Date('2026-10-26T04:00:00Z')),'2026-10-26');
 assert.equal(accountDay(new Date('2026-11-02T04:59:59Z')),'2026-11-01');
 assert.equal(accountDay(new Date('2026-11-02T05:00:00Z')),'2026-11-02');
 assert.equal(previousAccountDay('2027-01-01'),'2026-12-31');
 assert.equal(previousAccountDay('2024-03-01'),'2024-02-29');
});
test('streak display preserves yesterday, expires after a missed day and keeps the best',()=>{
 const now=new Date('2026-10-26T12:00:00Z'),profile={login_streak:4,login_best:10,login_last_day:'2026-10-25',login_days:['2026-10-25']};
 assert.equal(loginStreak(profile,now).current,4);
 assert.equal(loginStreak({...profile,login_last_day:'2026-10-26'},now).current,4);
 assert.equal(loginStreak({...profile,login_last_day:'2026-10-24'},now).current,0);
 assert.equal(loginStreak({...profile,login_last_day:'2026-10-24'},now).best,10);
 assert.equal(loginStreak(null,now).current,0);
});
test('all offered accent colors support readable white text',()=>{
 const luminance=hex=>hex.match(/\w\w/g).map(value=>parseInt(value,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4).reduce((sum,c,i)=>sum+c*[.2126,.7152,.0722][i],0);
 for(const color of ACCOUNT_COLORS)assert.ok(1.05/(luminance(color.accent.slice(1))+.05)>=4.5,color.name);
 assert.equal(accountColor('unknown').id,'forest');
});
