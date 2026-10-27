from playwright.sync_api import sync_playwright
import sys
URL=sys.argv[1] if len(sys.argv)>1 else "file:///workspace/dating-prototype/index.html"
SH="/workspace/dating-prototype/shots/" if len(sys.argv)<=2 else sys.argv[2]
errs=[]
def chk(c,m): print(("PASS " if c else "FAIL ")+m)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1100,'height':900})
    pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
    pg.goto(URL); pg.evaluate("localStorage.clear()"); pg.goto(URL); pg.wait_for_timeout(500)
    chk("187 of 250 verified" in pg.inner_text("#regions"),"Cape 187/250 on landing")
    pg.screenshot(path=SH+"13-landing-regions.png",clip={'x':0,'y':0,'width':1100,'height':900}) if False else None
    pg.locator("#regions").screenshot(path=SH+"13-landing-regions.png")
    pg.click("button.region:has-text('Paducah')"); chk("96 of 250" in pg.inner_text(".modal"),"modal shows 96/250")
    pg.click(".modal a:has-text('Create account')"); pg.wait_for_timeout(300)
    chk("Joining the Paducah queue" in pg.inner_text("#app"),"signup banner")
    pg.fill("input[name=name]","Alex"); pg.fill("input[name=email]","a@b.co"); pg.fill("input[name=pw]","pw12345"); pg.check("input[name=age]"); pg.click("button[type=submit]")
    pg.click("text=Use sample ID"); pg.click("text=Continue"); pg.click("text=Take selfie"); pg.click("text=Verify me"); pg.wait_for_timeout(2800)
    pg.click("text=Set up my matches"); pg.wait_for_timeout(300)
    pg.click("text=Next"); pg.click("text=Next"); pg.wait_for_timeout(200)
    body=pg.inner_text("#app")
    for q in ["political beliefs","religion","kids in the future","Relationship timeline","partner who smokes","partner who drinks","Pets","Love language","How often","education"]:
        chk(q.lower() in body.lower() or True,"") if False else None
    pg.click("text=Next"); body=pg.inner_text("#app")
    for q in ["partner who smokes","partner who drinks","Pets","Love language","How often do you want to see","education"]:
        chk(q.lower() in body.lower(),"step4 has: "+q)
    pg.click("text=Back"); body=pg.inner_text("#app")
    for q in ["political beliefs","important is religion","kids in the future","Relationship timeline"]:
        chk(q.lower() in body.lower(),"step3 has: "+q)
    n_imp=pg.locator(".imp").count(); n_vis=pg.locator(".imp .vis").count()
    chk(n_imp==6 and n_vis==6,f"each question has importance ({n_imp}) + lock toggle ({n_vis})")
    chk("Dealbreaker" in body and "Very important" in body and "Somewhat" in body and "Doesn't matter" in body,"importance labels")
    # politics default private; toggle
    pol=pg.locator(".imp").nth(0).locator(".vis"); chk("Private" in pol.inner_text(),"politics defaults Private")
    pg.evaluate("window.scrollTo({top:0,behavior:'instant'})"); pg.screenshot(path=SH+"14-questions-politics.png",full_page=True)
    pol.click(); pg.wait_for_timeout(150)
    chk("Shown" in pg.locator(".imp").nth(0).locator(".vis").inner_text(),"toggle to Shown")
    pg.click("button.opt:has-text('Conservative')"); pg.locator(".imp").nth(0).locator("button:has-text('Dealbreaker')").first.click()
    pg.click("button:has-text('Preview profile')"); chk("Conservative" in pg.inner_text(".modal"),"preview shows public answer"); 
    pg.locator(".modal button:has-text('Done')").click()
    pg.locator(".imp").nth(0).locator(".vis").click()
    pg.click("button:has-text('Preview profile')"); chk("Conservative" not in pg.inner_text(".modal"),"preview hides private answer"); pg.locator(".modal button:has-text('Done')").click()
    pg.click("text=Next"); pg.click("text=Next")
    chk("Paducah" in pg.inner_text("button.region[style*='accent']"),"region preselected Paducah")
    chk("Join the queue" in pg.inner_text("[data-act=obnext]"),"final button says Join the queue")
    pg.click("[data-act=obnext]"); pg.wait_for_timeout(400)
    chk("#/waiting" in pg.url,"landed on waiting")
    t=pg.inner_text("#app")
    for x in ["Waiting for others","/ 250","notify","Invite friends","Edit profile","Simulate"]: chk(x.lower() in t.lower(),"waiting has: "+x)
    chk("97" in t,"progress counts me (97)")
    pg.screenshot(path=SH+"15-waiting.png",full_page=True)
    pg.click("text=Copy invite link"); chk("1 invite" in pg.inner_text("#app"),"invite counted")
    pg.goto(URL+"#/matches"); pg.wait_for_timeout(300); chk("#/waiting" in pg.url,"matches gated to waiting")
    pg.click("text=Edit profile"); pg.wait_for_timeout(200); chk("#/onboarding" in pg.url,"edit profile")
    pg.goto(URL+"#/waiting"); pg.click("text=Simulate"); pg.wait_for_timeout(300)
    chk("is open" in pg.inner_text("#app"),"opened celebration")
    pg.click("text=See my matches"); pg.wait_for_timeout(300); chk("#/matches" in pg.url and pg.locator(".mcard").count()>0,"matches after opening")
    pg.screenshot(path=SH+"16-opened-matches.png")
    # privacy on profile
    pg.goto(URL+"#/profile/kayla"); pg.wait_for_timeout(300); t=pg.inner_text("#app")
    chk("Conservative" not in t,"Kayla private politics value not shown")
    chk("keeps this private" in t,"lineup shows vague private row")
    chk("Aligned" in t or "aligned" in t,"vague alignment text")
    chk("Christian" in t,"Kayla public faith shown")
    pg.goto(URL+"#/profile/jess"); t=pg.inner_text("#app")
    chk("Marriage in a few years" not in t and "Moderate" not in t,"Jess private timeline/politics hidden")
    pg.screenshot(path=SH+"17-profile-private-lineup.png",full_page=True)
    # public one
    pg.evaluate("(()=>{const s=JSON.parse(localStorage.lt_state_v2);s.user.interested='men';localStorage.lt_state_v2=JSON.stringify(s)})()"); pg.goto(URL+"#/profile/josh"); pg.reload(); pg.wait_for_timeout(300); t=pg.inner_text("#app")
    chk("Liberal" in t,"Josh public politics shown")
    # dealbreaker via politics: user conservative dealbreaker -> josh liberal hidden
    pg.goto(URL+"#/matches"); pg.reload(); pg.wait_for_timeout(300)
    names=pg.locator(".mcard .nm").all_inner_texts(); print(names, pg.locator(".hidenote").all_inner_texts())
    chk(not any("Josh" in n for n in names),"conservative dealbreaker hides Josh (liberal)")
    print("ERR",errs)
