# Image
# Use an image card to display an image by specifying its URL or a data URL in case of the base64-encoded #image.
# ---
from h2o_wave import site, ui
import io
import base64
import numpy as np
import matplotlib.pyplot as plt

n = 25
plt.figure(figsize=(3, 3))
plt.scatter(
    [0.7003673, 0.74275081, 0.70928001, 0.56674552, 0.97778533, 0.70633485,
     0.24791576, 0.15788335, 0.69769852, 0.71995667, 0.25774443, 0.34154678,
     0.96876117, 0.6945071, 0.46638326, 0.7028127, 0.51178587, 0.92874137,
     0.7397693, 0.62243903, 0.65154547, 0.39680761, 0.54323939, 0.79989953,
     0.72154473],
    [0.29536398, 0.16094588, 0.20612551, 0.13432539, 0.48060502, 0.34252181,
     0.36296929, 0.97291764, 0.11094361, 0.38826409, 0.78306588, 0.97289726,
     0.48320961, 0.33642111, 0.56741904, 0.04794151, 0.38893703, 0.90630365,
     0.16101821, 0.74362113, 0.63297416, 0.32418002, 0.92237653, 0.23722644,
     0.82394557],
    s=(30 * np.asarray([
        0.75060714, 0.11378445, 0.84536125, 0.92393213, 0.22083679, 0.93305388,
        0.48899874, 0.47471864, 0.08916747, 0.22994818, 0.71593741, 0.49612616,
        0.76648938, 0.89679732, 0.77222302, 0.92717429, 0.61465203, 0.60906377,
        0.68468487, 0.25101297, 0.83783764, 0.11861562, 0.79723474, 0.94900427,
        0.14806288])) ** 2,
    c=[0.90687198, 0.78837333, 0.76840584, 0.59849648, 0.44214562, 0.72303802,
       0.41661825, 0.2268104, 0.45422734, 0.84794375, 0.93665595, 0.95603618,
       0.39209432, 0.70832467, 0.12951583, 0.35379639, 0.40427152, 0.6485339,
       0.03307097, 0.53800936, 0.13171312, 0.52093493, 0.10248479, 0.15798038,
       0.92002965],
    alpha=0.5,
)

buf = io.BytesIO()
plt.savefig(buf, format='png')
buf.seek(0)
image = base64.b64encode(buf.read()).decode('utf-8')

page = site['/demo']
page['example1'] = ui.image_card(
    box='1 1 2 4',
    title='An image',
    type='png',
    image=image,
)

# Another way to achieve the same result is to use a data URL for the path:
# The example below constructs the data URL from the base64-encoded
#   used in the previous example.
page['example2'] = ui.image_card(
    box='3 1 2 4',
    title='An image',
    path=f"data:image/png;base64,{image}",
)

page.save()