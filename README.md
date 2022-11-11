# Terminate all JavaScript on a page

Like `process.stop()` in NodeJS but for browsers (Without reloading the page).

Stopping all execution in browsers main thread isn't easy. 
You need to manually clean up everything after yourself.
And there isn't any easy way to GC everything or terminating a running `<script>` tag.

It's easy to disable all JavaScript on a site but that oftan requires you to reload the hole page.
The site might not render at all cuz it depends on javascript to render the page.

I wanted to have this as an easy bookmarklet to hinder paywalls, anti-adblocker and anti-debugger and terminating some very annoying scroll behaviors on websites.

Just save create a new bookmarklet and save it as:
```js
import('https://comming_soon')
```
