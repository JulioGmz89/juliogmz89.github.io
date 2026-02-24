## **1. Purpose**

The Object Pool Manager is a performance-critical system designed to eliminate the overhead of frequently creating and destroying game objects at runtime. Operations like `Instantiate()`and `Destroy()`are slow and generate memory garbage, which can cause noticeable frame rate stutters. This system solves that problem by recycling a pre-allocated set of objects, ensuring smooth performance even when spawning hundreds of projectiles or enemies per second.

## **2. Architecture**

The system is composed of a central manager that oversees multiple individual pools, with each pool handling a specific type of object (e.g., one for player bullets, another for explosions).

- **ObjectPoolManager (Singleton):** The core of the system. It's a globally accessible Singleton (`ObjectPoolManager.Instance`) that holds a dictionary of all object pools. It is responsible for initializing the pools and providing public methods to spawn and return objects.
- **Pool (Serializable Class):** A simple data structure configured in the Unity Inspector. It defines the properties for a single pool:
    - **`tag`**: A unique string identifier (e.g., "PlayerProjectile").
    - **`prefab`**: The `GameObject` prefab that this pool will manage.
    - **`size`**: The number of objects to create and pre-allocate when the game starts.
- `Dictionary<string, Queue<GameObject>>`**:** The primary data structure within the manager. The `string` key is the pool's `tag`, and the  `Queue<GameObject>`is a highly efficient collection that stores the inactive, ready-to-use objects for that pool.
- **IPooledObject (Interface):** An interface that allows pooled objects to "reset" themselves when they are spawned. Any script on a pooled prefab can implement this interface. It contains a single method, **OnObjectSpawn()**, which the **ObjectPoolManager** calls immediately after activating an object, giving it a chance to reset its health, velocity, or other properties.

### **Interaction Flow:**

1. **Initialization:** At the start, **ObjectPoolManager** iterates through its list of `Pools`, instantiates the specified number of prefabs for each, deactivates them, and stores them in their respective `Queue`.
2. **Spawning:** A script requests an object using its tag. The manager dequeues an object from the correct pool, activates it, sets its position/rotation, and calls **OnObjectSpawn()** if the object is an **IPooledObject**.
3. **Returning:** When an object is finished, it is returned to the manager. The manager deactivates it and enqueues it back into its pool, ready to be used again.

## **3. User Manual**

- `public static ObjectPoolManager Instance { get; private set; }`
    - **Description:** The static property used to get the single, global instance of the manager.
    - **Returns:** The **ObjectPoolManager** instance.
- `public GameObject SpawnFromPool(string tag, Vector3 position, Quaternion rotation)`
    - **Description:** Retrieves an object from the specified pool, activates it, and places it at the desired position and rotation.
    - **Parameters:**
        - **`tag`**: The string identifier of the pool you want to draw from.
        - **`position`**: The world-space position to spawn the object at.
        - **`rotation`**: The world-space rotation to spawn the object with.
    - **Returns:** The activated `GameObject` from the pool. Returns `null` if the tag does not exist.
- `public void ReturnToPool(string tag, GameObject objectToReturn)`
    - **Description:** Deactivates a  `GameObject` and returns it to its corresponding pool for later reuse.
    - **Parameters:**
        - **`tag`**: The string identifier of the pool the object belongs to.
        - **`objectToReturn`**: The `GameObject` instance you are returning.

## **4. Usage Example**

Here is how the PlayerController uses the system to fire a projectile, and how the **Projectile** script manages its own lifecycle.

### **1. Spawning an object**

Instead of `Instantiate`, we call **SpawnFromPool()**.

```csharp
// Inside the PlayerController's HandleFiring() method

private void HandleFiring()
{
    if (isFiring && Time.time >= nextFireTime)
    {
        if (firePoint != null)
        {
            // Use the pool manager to get a projectile instead of instantiating a new one.
            ObjectPoolManager.Instance.SpawnFromPool("PlayerProjectile", firePoint.position, firePoint.rotation);
            
            nextFireTime = Time.time + 1f / fireRate;
        }
    }
}
```

### **2. Implementing IPooledObject and returning to the pool**

```csharp
public class Projectile : MonoBehaviour, IPooledObject
{
    [SerializeField] private float moveSpeed = 20f;
    [SerializeField] private float lifeTime = 2f;
    private Rigidbody2D rb;

    private void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    // This method is called by the ObjectPoolManager when the projectile is spawned.
    public void OnObjectSpawn()
    {
        rb.linearVelocity = transform.up * moveSpeed;
        
        // Automatically return to the pool after 'lifeTime' seconds.
        Invoke(nameof(ReturnToPool), lifeTime);
    }

    // Helper method to return this object to the pool.
    private void ReturnToPool()
    {
        ObjectPoolManager.Instance.ReturnToPool("PlayerProjectile", gameObject);
    }

    // Example: Return to pool immediately on collision.
    private void OnCollisionEnter2D(Collision2D collision)
    {
        CancelInvoke(nameof(ReturnToPool)); // Stop the timed return.
        ReturnToPool();
    }
}
```