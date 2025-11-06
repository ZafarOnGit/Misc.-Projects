mylist = []
while True:
    userinput = input("Enter the list items one by one and type done when finished");
    if userinput.lower() == "done":
        break

    mylist.append(userinput)

print(mylist)