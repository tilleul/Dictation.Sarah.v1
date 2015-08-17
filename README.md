# Dictation.Sarah.v1
Un essai d'utilisation du moteur de Speech Recognition de Google Chrome avec Sarah.

Ceci est tout à fait expérimental. Il s'agit essentiellement de vérifier la faisabilité de la chose.

Le code est loin d'être parfait mais il fonctionne. 

Pour plus d'infos et de support, allez sur http://www.sarah-forum.net/phpBB3/viewtopic.php?f=35&t=219 ou sur https://plus.google.com/u/0/112914979604776526292/posts/7UXaQg1KZUh?cfem=1

Prérequis:
- Sarah v3 (pas testé avec v4)
- node.js installé sur le PC (pas testé avec le node.js de Sarah)

Utilisation:
- éditez le fichier custom.ini de Sarah et remplacez la ligne
`name=SARAH`
par
`name=Abracadabra Sarah`
(voir "principe" pour l'explication)
- lancez le script avec
`node speech_test.js`
- ouvrez chrome et naviguez vers https://127.0.0.1:4300  (HTTPS !!!)
- validez le certificat SSL temporaire
- validez l'utilisation du micro (comme c'est de l'HTTPS cette question sera posée une et une seule fois)
- lancez Sarah client+serveur
- parlez à Sarah et vérifiez sur la page ouverte dans Chrome et dans les logs ce qu'elle a compris ...


Principe:
- un serveur HTTPS (pour éviter la confirmation de l'utilisation du micro) en node.js avec une page type dictation.io
- chaque phrase reconnue est envoyée sur une page proxy du même serveur qui forwarde le même querystring vers le client Sarah par la méthode "emulate" (http://127.0.0.1:8888/?emulate=Sarah+quelle+heure+est+il)
- Pour éviter que le client de Sarah ne réponde également, on renomme "Sarah" dans le custom.ini en "Abracadabra Sarah". Le proxy ajoute automatiquement le "abracadabra", et on peut donc continuer à dire simplement "Sarah" 

Ca marche mais ...
- L'orthographe dans la grammaire XML doit EXACTEMENT correspondre à ce que Google Chrome a déchiffré
- De même il est du coup obligatoire de prononcer très exactement la phrase qui est attendue par la grammaire. "Sarah je veux écouter l'abum Abbey Road des Beatles" sera différent de "Sarah je veux écouter l'album Abbery Road des The Beatles"
- Le moteur vocal de Chrome ne s'attend pas à entendre des phrases à l'impératif, donc tous les verbes qui ne font pas partie du 1er groupe (donc tous les verbes qui ne sont pas en -ER) posent problème. Par ex: "Sarah éteins la lumière" (impératif) sera compris "Sarah éteint la lumière" (indicatif), il faut donc corriger les grammaires au cas par cas
- Parfois Chrome bizarrement comprend l'impératif. Ex: "Sarah fais la poule" passe. Mais par contre on aura "Sarah fait le canard" ...
- Le client Sarah est programmé pour ne pas écouter quand Sarah parle. Ce n'est pas le cas de Chrome qui écoute en permanence et qui donc peut entendre Sarah qui répond (!). On pourrait éventuellement supprimer ce problème en coupant le micro juste avant que Sarah ne parle mais cela signifie modifier les plugins pour ne plus utiliser le TTS directement dans le XML et modifier le code JS pour couper le micro avant un SARAH.Speak ou un Callback(tts) (sans oublier de remettre le micro)
- Le nom "Sarah" n'est CLAIREMENT pas le plus approprié pour Chrome qui lorsqu'on lui dit "Sarah fait le cheval" à tendance à comprendre "Saint-Raphaël cheval"

Une autre approche sera utilisée prochainement: stockage dans une DB simple (flat ?) des dernières phrases reconnues, exploitation par Sarah uniquement sur demande, cela pourrait donc peut-être convenir pour des GARBAGE ou des ASKME ? A suivre ...