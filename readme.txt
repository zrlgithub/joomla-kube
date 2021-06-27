Folderul chat contine aplicatia de chat folosita, alaturi de Dockerfile.
Folderul joomla contine yaml-urile pentru deploymentul de joomla.
Folderul letschat contine yaml-urile pentru deploymentul de chat.
Avem nevoie de a ne crea un secret pentru conexiunea cu baza de date.
Comenzi:
kubectl create secret generic mariadb-secret2 --namespace=joomla
                             --from-literal=dbuser=user_joomla
                             --from-literal=dbname=joomla
                             --from-literal=dbpassword=password1234
                             --from-literal=dbrootpassword=root1234
                             -o yaml --dry-run='none' > mariadb-secret.yaml

kubectl apply -f /letschat
kubectl apply -f /joomla
