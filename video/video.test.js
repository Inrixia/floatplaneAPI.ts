const video = new (require('./'))(require('got').extend({ mutableDefaults: true }))
video.cookie = (new (require('@inrixia/db'))('credentials', './credentials.json', false)).cookie

test('url', () => expect(video.url('dDdmyd8biA')).resolves.toMatch(/https:\/\/Edge\d\d-..\.floatplane\.com\/Videos\/dDdmyd8biA\/360\.mp4/));