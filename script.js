// Configure AWS SDK
AWS.config.update({
    region: "ap-south-1", // Your region
    credentials: new AWS.Credentials("#", "#")
});


const ec2 = new AWS.EC2();

let instances = []; // Store instances for reference

// Fetch EC2 Instances
async function fetchInstances() {
    const params = {
        Filters: [
            { Name: "instance-state-name", Values: ["running", "stopped", "stopping", "pending", "shutting-down"] }
        ]
    };

    try {
        const data = await ec2.describeInstances(params).promise();
        instances = data.Reservations.flatMap(reservation => reservation.Instances);
        populateInstanceDropdown();
    } catch (err) {
        console.error("Error fetching instances:", err);
    }
}

// Populate the dropdown with instance names
function populateInstanceDropdown() {
    const dropdown = document.getElementById("instance-dropdown");
    dropdown.innerHTML = ""; // Clear existing options

    instances.forEach(instance => {
        console.log(instance,"instance")
        const option = document.createElement("option");
        option.value = instance.InstanceId;
        option.textContent = `ServerName:- ${instance.KeyName.toUpperCase()} - ${instance.State.Name}`;
        dropdown.appendChild(option);
    });
}

// Change Instance State
async function changeInstanceState(action) {
    const instanceId = document.getElementById("instance-dropdown").value;
    if (!instanceId) return alert("Please select an instance!");

    let params;
    
    try {
        switch (action) {
            case 'start':
                params = { InstanceIds: [instanceId] };
                await ec2.startInstances(params).promise();
                alert("Server Successfully Start!!!")
                break;
            case 'stop':
                params = { InstanceIds: [instanceId] };
                await ec2.stopInstances(params).promise();
                alert("Server Successfully Stop!!!")
                break;
            case 'reboot':
                params = { InstanceIds: [instanceId] };
                await ec2.rebootInstances(params).promise();
                alert("Server Successfully Reboot!!!")
                break;
            case 'terminate':
                params = { InstanceIds: [instanceId] };
                await ec2.terminateInstances(params).promise();
                alert("Server Successfully Terminated!!!")
                break;
            case 'hibernate':
                params = { InstanceIds: [instanceId] };
                await ec2.hibernateInstances(params).promise();
                alert("Server Successfully Hibernated!!!")
                break;
            default:
                break;
        }
        // Refresh the instance list after performing the action
        await fetchInstances();
    } catch (err) {
        console.error(`Error during ${action}:`, err);
        alert(`Failed to ${action} the instance: ${err.message}`);
    }
}

// Initial fetch of instances
fetchInstances();
