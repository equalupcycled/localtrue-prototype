from playwright.sync_api import sync_playwright
URL="file:///workspace/dating-prototype/index.html"
SH="/workspace/dating-prototype/shots/"
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1100,'height':900}); errs=[]
    pg.on("pageerror",lambda e:errs.append(str(e)))
    pg.goto(URL); pg.evaluate("localStorage.clear()"); pg.goto(URL+"#/login"); pg.click("button[type=submit]"); pg.wait_for_timeout(300)
    pg.goto(URL+"#/onboarding"); pg.wait_for_timeout(300)
    pg.click("text=Next"); pg.click("text=Next")
    print("imp rows:",pg.locator(".imp").count())
    pg.locator(".q:has-text('kids in the future') + .opts button").nth(0).click()
    pg.locator(".imp").nth(4).locator("button:has-text('Dealbreaker')").click(); pg.wait_for_timeout(200)
    print("deal on:",pg.locator(".imp").nth(4).locator("button.on").inner_text())
    pg.screenshot(path=SH+"10-importance.png")
    pg.click("text=Next"); pg.click("text=Next"); pg.click("text=See my matches"); pg.wait_for_timeout(400)
    print("cards:",pg.locator(".mcard").count(), pg.locator(".hidenote").inner_text())
    print([x for x in pg.locator(".mcard .nm").all_inner_texts()], pg.locator(".score").all_inner_texts())
    pg.screenshot(path=SH+"11-matches-weighted.png")
    pg.goto(URL+"#/profile/amber"); pg.wait_for_timeout(300)
    print("blocked banner:", "Outside your dealbreakers" in pg.inner_text("body"))
    pg.goto(URL+"#/profile/jess"); pg.wait_for_timeout(300); print(pg.locator(".lu").count(),"lineup rows")
    pg.screenshot(path=SH+"12-profile-lineup.png",full_page=True)
    print(errs)
